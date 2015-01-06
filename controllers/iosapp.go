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
	"net/http"
	"regexp"

	"models"

	// "appengine"
	"appengine/datastore"
	"appengine/urlfetch"

	"github.com/PuerkitoBio/goquery"
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

func (this *IOSAppController) GetEntity() {
	keyName := this.Ctx.Input.Param(":key_name")
	key := datastore.NewKey(this.AppEngineCtx, "IOSApp", keyName, 0, nil)
	var iosapp models.IOSApp
	getErr := datastore.Get(this.AppEngineCtx, key, &iosapp)
	if getErr != nil {
		this.Data["json"] = getErr
		return
	} else {
		this.Data["json"] = &iosapp
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

func (this *IOSAppController) GetReview() {
	client := urlfetch.Client(this.AppEngineCtx)
	req, err := http.NewRequest("GET", "https://itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?id=503424369&pageNumber=0&sortOrdering=4&onlyLatestVersion=false&type=Purple+Software", nil)
	req.Header.Add("X-Apple-Store-Front", "143462")
	req.Header.Add("User-Agent", "iTunes/9.2 (Macintosh; U; Mac OS X 10.6)")
	resp, err := client.Do(req)
	if err != nil {
		this.Data["json"] = err
		return
	}
	// path := xmlpath.MustComile("View/VBoxView/View/MatrixView/VBoxView/VBoxView/VBoxView")
	doc, _ := goquery.NewDocumentFromResponse(resp)
	i := 0
	doc.Find("Document View VBoxView View MatrixView VBoxView:nth-child(1) VBoxView VBoxView").Each(func(_ int, s *goquery.Selection) {
		title := s.Find("HBoxView TextView SetFontStyle b").First().Text()
		if title != "" {
			i = i + 1
			log.Println(i)
			log.Println(title)
			reviewIDURL, idExists := s.Find("HBoxView VBoxView GotoURL").First().Attr("url")
			if idExists {
				regex_str := "([0-9]+$)"
				re, err := regexp.Compile(regex_str)
				if err != nil {
					panic(err)
				}
				reviewID := re.FindString(reviewIDURL)
				log.Println(reviewID)
			}
		}

	})
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
