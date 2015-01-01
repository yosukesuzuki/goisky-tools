package models

import (
	"time"

	"appengine"
	"appengine/datastore"
)

// IOSAPP is a kind which store information around iOS App
type IOSApp struct {
	AppID      string    `json:"app_id" datastore:"app_id"`
	Title      string    `json:"title" datastore:"title"`
	WebhookURL string    `json:"webhook_url" datastore:"webhook_url"`
	Content    string    `json:"content" datastore:"content,noindex"`
	Region     string    `json:"region" datastore:"region"`
	UpdatedAt  time.Time `json:"updated_at" datastore:"updated_at"`
	CreatedAt  time.Time `json:"created_at" datastore:"created_at"`
}

func (ia *IOSApp) key(c appengine.Context) *datastore.Key {
	keyName := ia.AppID
	return datastore.NewKey(c, "IOSApp", keyName, 0, nil)
}

func (ia *IOSApp) Create(c appengine.Context) (*IOSApp, error) {
	ia.CreatedAt = time.Now()
	ia.UpdatedAt = time.Now()
	_, err := datastore.Put(c, ia.key(c), ia)
	if err != nil {
		return nil, err
	}
	return ia, nil
}

func (ia *IOSApp) Update(c appengine.Context) (*IOSApp, error) {
	ia.UpdatedAt = time.Now()
	_, err := datastore.Put(c, ia.key(c), ia)
	if err != nil {
		return nil, err
	}
	return ia, nil
}
