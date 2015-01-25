// EXAMPLE FROM: https://github.com/GoogleCloudPlatform/appengine-angular-gotodos
//
// Copyright 2013 Google Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

// gotodos is an App Engine JSON backend for managing a todo list.
//
// It supports the following commands:
//
// - Create a new todo
// POST /todos
// > {"text": "do this"}
// < {"id": 1, "text": "do this", "created": 1356724843.0, "done": false}
//
// - Update an existing todo
// POST /todos
// > {"id": 1, "text": "do this", "created": 1356724843.0, "done": true}
// < {"id": 1, "text": "do this", "created": 1356724843.0, "done": true}
//
// - List existing todos:
// GET /todos
// >
// < [{"id": 1, "text": "do this", "created": 1356724843.0, "done": true},
//    {"id": 2, "text": "do that", "created": 1356724849.0, "done": false}]
//
// - Delete 'done' todos:
// DELETE /todos
// >
// <

package controllers

import (
	"encoding/json"
	"io"
	"log"
	"models"

	"appengine"
	"appengine/blobstore"
	"appengine/datastore"
	"appengine/image"

	"github.com/yosukesuzuki/beegae"
)

type BlobStoreImageController struct {
	beegae.Controller
}

func (this *BlobStoreImageController) UploadURL() {
	uploadURL, err := blobstore.UploadURL(this.AppEngineCtx, "/admin/api/v1/blobstoreimage/handler", nil)
	if err != nil {
		this.Data["json"] = err
		return
	}
	listDataSet := map[string]interface{}{"uploadurl": uploadURL.Path}
	this.Data["json"] = listDataSet
}

func (this *BlobStoreImageController) Handler() {
	blobs, _, err := blobstore.ParseUpload(this.Ctx.Request)
	if err != nil {
		log.Println("parse error")
		this.Data["json"] = err
		return
	}
	file := blobs["file"]
	if len(file) == 0 {
		log.Println("no file uploaded")
		this.Data["json"] = err
		return
	}
	var imageOptions image.ServingURLOptions
	imageURL, err := image.ServingURL(this.AppEngineCtx, file[0].BlobKey, &imageOptions)
	if err != nil {
		log.Println("cannot get ServingURL")
		this.Data["json"] = err
		return
	}
	var blobstoreimage models.BlobStoreImage
	imageURLString := "//" + imageURL.Host + imageURL.Path
	blobstoreimage.BlobKey = string(file[0].BlobKey)
	blobstoreimage.Title = file[0].Filename
	blobstoreimage.ImageURL = imageURLString
	_, err = blobstoreimage.Create(this.AppEngineCtx)
	this.Data["json"] = map[string]string{"status": "done"}
}

func (this *BlobStoreImageController) Get() {
	blobstoreimage := []models.BlobStoreImage{}
	_, err := datastore.NewQuery("BlobStoreImage").Order("-UpdatedAt").GetAll(this.AppEngineCtx, &blobstoreimage)
	if err != nil {
		this.Data["json"] = err
		return
	}
	listDataSet := map[string]interface{}{"items": blobstoreimage}
	this.Data["json"] = listDataSet
}

func (this *BlobStoreImageController) Post() {
	blobstoreimage, err := decodeBlobStoreImage(this.Ctx.Input.Request.Body)
	if err != nil {
		log.Println("decode err")
		this.Data["json"] = err
		return
	}
	b, err := blobstoreimage.Create(this.AppEngineCtx)
	if err != nil {
		this.Data["json"] = err
	} else {
		this.Data["json"] = &b
	}
}

func (this *BlobStoreImageController) GetEntity() {
	keyName := this.Ctx.Input.Param(":key_name")
	key := datastore.NewKey(this.AppEngineCtx, "BlobStoreImage", keyName, 0, nil)
	var blobstoreimage models.BlobStoreImage
	err := datastore.Get(this.AppEngineCtx, key, &blobstoreimage)
	if err != nil {
		this.Data["json"] = err
		return
	} else {
		this.Data["json"] = &blobstoreimage
	}
}
func (this *BlobStoreImageController) UpdateEntity() {
	keyName := this.Ctx.Input.Param(":key_name")
	key := datastore.NewKey(this.AppEngineCtx, "BlobStoreImage", keyName, 0, nil)
	var blobstoreimage models.BlobStoreImage
	err := datastore.Get(this.AppEngineCtx, key, &blobstoreimage)
	if err != nil {
		this.Data["json"] = err
		return
	}
	err = json.NewDecoder(this.Ctx.Input.Request.Body).Decode(&blobstoreimage)
	if err != nil {
		this.Data["json"] = err
		return
	}
	b, err := blobstoreimage.Update(this.AppEngineCtx)
	if err != nil {
		this.Data["json"] = err
	} else {
		this.Data["json"] = &b
	}
}

func (this *BlobStoreImageController) DeleteEntity() {
	keyName := this.Ctx.Input.Param(":key_name")
	key := datastore.NewKey(this.AppEngineCtx, "BlobStoreImage", keyName, 0, nil)
	err := datastore.Delete(this.AppEngineCtx, key)
	if err == nil {
		this.Data["json"] = nil
	} else {
		this.Data["json"] = err
	}
	err = blobstore.Delete(this.AppEngineCtx, appengine.BlobKey(keyName))
	if err == nil {
		this.Data["json"] = nil
	} else {
		this.Data["json"] = err
	}
}

func (this *BlobStoreImageController) Render() error {
	if _, ok := this.Data["json"].(error); ok {
		this.AppEngineCtx.Errorf("blobstoreimag error: %v", this.Data["json"])
	}
	this.ServeJson()
	return nil
}

func decodeBlobStoreImage(r io.ReadCloser) (*models.BlobStoreImage, error) {
	defer r.Close()
	var blobstoreimage models.BlobStoreImage
	err := json.NewDecoder(r).Decode(&blobstoreimage)
	return &blobstoreimage, err
}
