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
	Update     time.Time `json:"update"`
	Created    time.Time `json:"created"`
}

func (ia *IOSApp) key(c appengine.Context) *datastore.Key {
	keyName := ia.AppID
	return datastore.NewKey(c, "IOSApp", keyName, 0, nil)
}

func (ia *IOSApp) Save(c appengine.Context) (*IOSApp, error) {
	_, err := datastore.Put(c, ia.key(c), ia)
	if err != nil {
		return nil, err
	}
	return ia, nil
}
