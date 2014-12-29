package models

import (
	"time"

	"appengine"
	"appengine/datastore"
)

// AppReview is a kind which stores reviews of a app, a record == a review
type AppReview struct {
	AppID    string    `json:"app_id" datastore:"app_id"`
	ReviewID string    `json:"review_id" datastore:"app_id"`
	Star     string    `json:"star" datastore:"star"`
	Title    string    `json:"title" datastore:"title,noindex"`
	Content  string    `json:"content" datastore:"content,noindex"`
	Done     bool      `json:"done"`
	Created  time.Time `json:"created"`
}

func (ar *AppReview) key(c appengine.Context) *datastore.Key {
	keyName := ar.AppID + "_" + ar.ReviewID
	return datastore.NewKey(c, "AppReview", keyName, 0, nil)
}

// Save puts to datastore
func (ar *AppReview) Save(c appengine.Context) (*AppReview, error) {
	_, err := datastore.Put(c, ar.key(c), ar)
	if err != nil {
		return nil, err
	}
	return ar, nil
}
