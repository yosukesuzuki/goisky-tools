package models

import (
	"time"

	"appengine"
	"appengine/datastore"
)

// IOSAPP is a kind which store information around iOS App
type BlobStoreImage struct {
	KeyName   string    `json:"key_name" datastore:"KeyName"`
	Title     string    `json:"title" datastore:"Tite"`
	Note      string    `json:"note" datastore:"Note"`
	BlobKey   string    `json:"blob_key" datastore:"BlobKey"`
	ImageURL  string    `json:"image_url" datastore:"ImageURL"`
	UpdatedAt time.Time `json:"updated_at" datastore:"UpdatedAt"`
	CreatedAt time.Time `json:"created_at" datastore:"CreatedAt"`
}

func (b *BlobStoreImage) key(c appengine.Context) *datastore.Key {
	return datastore.NewKey(c, "BlobStoreImage", b.KeyName, 0, nil)
}

func (b *BlobStoreImage) Exists(c appengine.Context) bool {
	b.KeyName = b.BlobKey
	var blobstoreimage BlobStoreImage
	err := datastore.Get(c, b.key(c), &blobstoreimage)
	if err != nil {
		return false
	}
	return true
}

func (b *BlobStoreImage) Create(c appengine.Context) (*BlobStoreImage, error) {
	b.KeyName = b.BlobKey
	b.CreatedAt = time.Now()
	b.UpdatedAt = time.Now()
	_, err := datastore.Put(c, b.key(c), b)
	if err != nil {
		return nil, err
	}
	return b, nil
}

func (b *BlobStoreImage) Update(c appengine.Context) (*BlobStoreImage, error) {
	b.UpdatedAt = time.Now()
	_, err := datastore.Put(c, b.key(c), b)
	if err != nil {
		return nil, err
	}
	return b, nil
}
