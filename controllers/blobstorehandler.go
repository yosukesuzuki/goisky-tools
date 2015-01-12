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
	"log"
	"models"

	"appengine"
	"appengine/blobstore"
	"appengine/datastore"
	"appengine/image"

	"github.com/yosukesuzuki/beegae"
)

type BlobStoreHandleController struct {
	beegae.Controller
}

func (this *BlobStoreHandleController) Handler() {
	q := datastore.NewQuery("__BlobInfo__").Order("-creation").Limit(100)
	t := q.Run(this.AppEngineCtx)
	for {
		var bi blobstore.BlobInfo
		key, err := t.Next(&bi)
		if err == datastore.Done {
			break
		}
		if err != nil {
			break
		}
		log.Println(appengine.BlobKey(key.StringID()))
		var imageOptions image.ServingURLOptions
		imageURL, err := image.ServingURL(this.AppEngineCtx, appengine.BlobKey(key.StringID()), &imageOptions)
		if err != nil {
			log.Println("cannot get ServingURL")
			this.Data["json"] = err
			return
		}
		var blobstoreimage models.BlobStoreImage
		blobstoreimage.Title = bi.Filename
		imageURLString := "//" + imageURL.Host + imageURL.Path
		blobstoreimage.BlobKey = string(key.StringID())
		blobstoreimage.ImageURL = imageURLString
		blobstoreimageExists := blobstoreimage.Exists(this.AppEngineCtx)
		if blobstoreimageExists == false {
			_, err = blobstoreimage.Create(this.AppEngineCtx)
			if err != nil {
				log.Println("cannot create entity")
				this.Data["json"] = err
				return
			}

		}
	}
	this.Data["json"] = map[string]string{"status": "done"}
}
