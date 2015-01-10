package models

import (
	"time"

	"appengine"
	"appengine/datastore"
)

// AppReview is a kind which stores reviews of a app, a entity == a review
type AppReview struct {
	AppID     string    `json:"app_id" datastore:"app_id"`
	ReviewID  string    `json:"review_id" datastore:"review_id"`
	Star      string    `json:"star" datastore:"star"`
	Title     string    `json:"title" datastore:"title,noindex"`
	Content   string    `json:"content" datastore:"content,noindex"`
	CreatedAt time.Time `json:"created_at" datastore:"created_at"`
}

func (ar *AppReview) key(c appengine.Context) *datastore.Key {
	keyName := ar.AppID + "_" + ar.ReviewID
	return datastore.NewKey(c, "AppReview", keyName, 0, nil)
}

// Save puts to datastore
func (ar *AppReview) Create(c appengine.Context) (*AppReview, error) {
	ar.CreatedAt = time.Now()
	_, err := datastore.Put(c, ar.key(c), ar)
	if err != nil {
		return nil, err
	}
	return ar, nil
}
