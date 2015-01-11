package models

import (
	"log"
	"time"

	"appengine"
	"appengine/datastore"
	"appengine/delay"
)

// AppReview is a kind which stores reviews of a app, a entity == a review
type AppReview struct {
	AppID     string    `json:"app_id" datastore:"AppID"`
	ReviewID  string    `json:"review_id" datastore:"ReviewID"`
	Star      string    `json:"star" datastore:"Star"`
	Title     string    `json:"title" datastore:"Tite,noindex"`
	Content   string    `json:"content" datastore:"Content,noindex"`
	CreatedAt time.Time `json:"created_at" datastore:"CreatedAt"`
}

func (ar *AppReview) key(c appengine.Context) *datastore.Key {
	keyName := ar.AppID + "_" + ar.ReviewID
	return datastore.NewKey(c, "AppReview", keyName, 0, nil)
}

func NotifyReviewToSlack(c appengine.Context, ar *AppReview) {
	var iosapp IOSApp
	key := datastore.NewKey(c, "IOSApp", ar.AppID, 0, nil)
	err := datastore.Get(c, key, &iosapp)
	if err != nil {
		c.Errorf("%v", err)
		return
	}
}

// Save puts to datastore
func (ar *AppReview) Create(c appengine.Context) (*AppReview, error) {
	var appreview AppReview
	err := datastore.Get(c, ar.key(c), &appreview)
	if err == nil {
		log.Println("already registered")
		return &appreview, nil
	}
	ar.CreatedAt = time.Now()
	_, err = datastore.Put(c, ar.key(c), ar)
	if err != nil {
		return nil, err
	}
	var notifyToSlackAsync = delay.Func("put", NotifyReviewToSlack)
	notifyToSlackAsync.Call(c, ar)
	return ar, nil
}
