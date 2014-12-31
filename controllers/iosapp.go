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

	// "appengine"
	"appengine/datastore"

	"github.com/astaxie/beegae"
)

type IOSAppController struct {
	beegae.Controller
}

func (this *IOSAppController) Get() {
	iosapps := []models.IOSApp{}
	_, err := datastore.NewQuery("IOSApp").Order("-updated_at").GetAll(this.AppEngineCtx, &iosapps)
	if err != nil {
		this.Data["json"] = err
		return
	}
	// for i := 0; i < len(iosapps); i++ {
	// 	iosapps[i].Id = ks[i].IntID()
	// }
	listDataSet := map[string]interface{}{"items": iosapps}
	this.Data["json"] = listDataSet
}

func (this *IOSAppController) Post() {
	iosapp, err := decodeIOSApp(this.Ctx.Input.Request.Body)
	if err != nil {
		log.Println("decode err")
		this.Data["json"] = err
		return
	}
	i, err := iosapp.Create(this.AppEngineCtx)
	if err != nil {
		this.Data["json"] = err
	} else {
		this.Data["json"] = &i
	}
}

func (this *IOSAppController) UpdateEntity() {
	keyName := this.Ctx.Input.Param(":key_name")
	key := datastore.NewKey(this.AppEngineCtx, "IOSApp", keyName, 0, nil)
	var iosapp models.IOSApp
	getErr := datastore.Get(this.AppEngineCtx, key, &iosapp)
	if getErr != nil {
		this.Data["json"] = getErr
		return
	}
	decodeErr := json.NewDecoder(this.Ctx.Input.Request.Body).Decode(&iosapp)
	if decodeErr != nil {
		this.Data["json"] = decodeErr
		return
	}
	i, err := iosapp.Update(this.AppEngineCtx)
	if err != nil {
		this.Data["json"] = err
	} else {
		this.Data["json"] = &i
	}
}

func (this *IOSAppController) DeleteEntity() {
	keyName := this.Ctx.Input.Param(":key_name")
	key := datastore.NewKey(this.AppEngineCtx, "IOSApp", keyName, 0, nil)
	err := datastore.Delete(this.AppEngineCtx, key)
	if err == nil {
		this.Data["json"] = nil
	} else {
		this.Data["json"] = err
	}
}

func (this *IOSAppController) Render() error {
	if _, ok := this.Data["json"].(error); ok {
		this.AppEngineCtx.Errorf("iosapp error: %v", this.Data["json"])
	}
	this.ServeJson()
	return nil
}

func decodeIOSApp(r io.ReadCloser) (*models.IOSApp, error) {
	defer r.Close()
	var iosapp models.IOSApp
	err := json.NewDecoder(r).Decode(&iosapp)
	return &iosapp, err
}
