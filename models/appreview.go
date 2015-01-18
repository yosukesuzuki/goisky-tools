package models

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"appengine"
	"appengine/datastore"
	"appengine/delay"
	"appengine/urlfetch"
)

// AppReview is a kind which stores reviews of a app, a entity == a review
type AppReview struct {
	KeyName   string    `json:"key_name" datastore:"KeyName"`
	AppID     string    `json:"app_id" datastore:"AppID"`
	ReviewID  string    `json:"review_id" datastore:"ReviewID"`
	Star      string    `json:"star" datastore:"Star"`
	Title     string    `json:"title" datastore:"Tite,noindex"`
	Content   string    `json:"content" datastore:"Content,noindex"`
	Version   string    `json:"version" datastore:"Version,noindex"`
	CreatedAt time.Time `json:"created_at" datastore:"CreatedAt"`
}

func (ar *AppReview) key(c appengine.Context) *datastore.Key {
	return datastore.NewKey(c, "AppReview", ar.KeyName, 0, nil)
}

func NotifyReviewToSlack(c appengine.Context, ar *AppReview) {
	var iosapp IOSApp
	key := datastore.NewKey(c, "IOSApp", ar.AppID, 0, nil)
	err := datastore.Get(c, key, &iosapp)
	if err != nil {
		c.Errorf("%v", err)
		return
	}
	client := urlfetch.Client(c)
	iconURL := "https://goisky-tools.appspot.com/media/img/appreviewicon.png"
	if iosapp.IconURL != "" {
		iconURL = iosapp.IconURL
	}
	text := "[" + iosapp.Title + "]\n" + ar.Title + ":\n" + ar.Content + "\n" + ar.Version
	payload := map[string]string{"text": text, "username": "slacktools", "icon_url": iconURL}
	payloadJSON, err := json.Marshal(payload)
	if err != nil {
		c.Errorf("%v", err)
		return
	}
	b := bytes.NewBuffer(payloadJSON)
	req, err := http.NewRequest("POST", iosapp.WebhookURL, b)
	req.Header.Set("Content-Type", "application/json")
	resp, err := client.Do(req)
	defer resp.Body.Close()
	log.Println(resp.Body)
}

var notifyToSlackAsync = delay.Func("put", NotifyReviewToSlack)

// Save puts to datastore
func (ar *AppReview) Create(c appengine.Context) (*AppReview, error) {
	var appreview AppReview
	ar.KeyName = ar.AppID + "_" + ar.ReviewID
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
	notifyToSlackAsync.Call(c, ar)
	return ar, nil
}
