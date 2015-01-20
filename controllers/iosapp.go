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
	"errors"
	"io"
	"log"
	"net/http"
	"regexp"
	"strings"

	"models"

	"appengine/datastore"
	"appengine/taskqueue"
	"appengine/urlfetch"

	"github.com/PuerkitoBio/goquery"
	"github.com/astaxie/beegae"
	"github.com/astaxie/beego/validation"
)

type IOSAppController struct {
	beegae.Controller
}

func (this *IOSAppController) Get() {
	iosapps := []models.IOSApp{}
	_, err := datastore.NewQuery("IOSApp").Order("-UpdatedAt").GetAll(this.AppEngineCtx, &iosapps)
	if err != nil {
		this.Data["json"] = err
		return
	}
	listDataSet := map[string]interface{}{"items": iosapps}
	this.Data["json"] = listDataSet
}

type ErrorMessage struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

func (this *IOSAppController) Post() {
	iosapp, err := decodeIOSApp(this.Ctx.Input.Request.Body)
	if err != nil {
		errorMessage := ErrorMessage{Status: "error", Message: err.Error()}
		this.Data["json"] = errorMessage
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
	err := datastore.Get(this.AppEngineCtx, key, &iosapp)
	if err != nil {
		this.Data["json"] = err
		return
	} else {
		this.Data["json"] = &iosapp
	}
}
func (this *IOSAppController) UpdateEntity() {
	keyName := this.Ctx.Input.Param(":key_name")
	key := datastore.NewKey(this.AppEngineCtx, "IOSApp", keyName, 0, nil)
	var iosapp models.IOSApp
	err := datastore.Get(this.AppEngineCtx, key, &iosapp)
	if err != nil {
		this.Data["json"] = err
		return
	}
	err = json.NewDecoder(this.Ctx.Input.Request.Body).Decode(&iosapp)
	if err != nil {
		this.Data["json"] = err
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

func (this *IOSAppController) GetAppReview() {
	keyName := this.Ctx.Input.Param(":key_name")
	key := datastore.NewKey(this.AppEngineCtx, "IOSApp", keyName, 0, nil)
	var iosapp models.IOSApp
	err := datastore.Get(this.AppEngineCtx, key, &iosapp)
	if err != nil {
		this.Data["json"] = err
		return
	}
	client := urlfetch.Client(this.AppEngineCtx)
	req, err := http.NewRequest("GET", "https://itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?pageNumber=0&sortOrdering=4&onlyLatestVersion=false&type=Purple+Software&id="+keyName, nil)
	req.Header.Add("X-Apple-Store-Front", iosapp.Region)
	req.Header.Add("User-Agent", "iTunes/9.2 (Macintosh; U; Mac OS X 10.6)")
	resp, err := client.Do(req)
	if err != nil {
		this.Data["json"] = err
		return
	}
	defer resp.Body.Close()
	regex_str := "([0-9]{4,}$)"
	re, err := regexp.Compile(regex_str)
	if err != nil {
		panic(err)
	}
	// regex_str_user_profile := "(userProfileId=[0-9]{4,}$)"
	// re_user_profile, err := regexp.Compile(regex_str_user_profile)
	// if err != nil {
	// 	panic(err)
	// }
	doc, _ := goquery.NewDocumentFromResponse(resp)
	doc.Find("Document View VBoxView View MatrixView VBoxView:nth-child(1) VBoxView VBoxView VBoxView").Each(func(_ int, s *goquery.Selection) {
		titleNode := s.Find("HBoxView>TextView>SetFontStyle>b").First()
		title := titleNode.Text()
		if title != "" {
			reviewIDURL, idExists := s.Find("HBoxView VBoxView GotoURL").First().Attr("url")
			if idExists {
				reviewID := re.FindString(reviewIDURL)
				var content string
				var versionAndDate string
				if len(reviewID) > 4 {
					num := 0
					log.Println(title)
					log.Println(reviewID)
					s.Find("TextView SetFontStyle").Each(func(_ int, sc *goquery.Selection) {
						num = num + 1
						if num == 4 {
							content = sc.Text()
							log.Println(content)
						}
					})
					userProfileNode := s.Find("HBoxView TextView SetFontStyle GotoURL").First()
					versionAndDate = userProfileNode.Parent().Text()
					versionAndDate = strings.Replace(versionAndDate, "\n", "", -1)
					versionAndDate = strings.Replace(versionAndDate, " ", "", -1)
					log.Printf("version and date: %v", versionAndDate)
					var appreview models.AppReview
					appreview.AppID = keyName
					appreview.ReviewID = reviewID
					appreview.Title = title
					appreview.Content = content
					appreview.Version = versionAndDate
					_, err = appreview.Create(this.AppEngineCtx)
					if err != nil {
						this.Data["json"] = err
						return
					}
				}

			}
		}

	})
}

func (this *IOSAppController) GetReviews() {
	iosapps := []models.IOSApp{}
	_, err := datastore.NewQuery("IOSApp").Order("-UpdatedAt").GetAll(this.AppEngineCtx, &iosapps)
	if err != nil {
		this.Data["json"] = err
		return
	}
	for i := 0; i < len(iosapps); i++ {
		log.Println(iosapps[i].AppID)
		t := taskqueue.NewPOSTTask("/admin/task/iosapp/getappreview/"+iosapps[i].AppID, nil)
		if _, err := taskqueue.Add(this.AppEngineCtx, t, ""); err != nil {
			this.Data["json"] = err
			return
		}
	}
	listDataSet := map[string]interface{}{"items": iosapps}
	this.Data["json"] = listDataSet
	// TODO set taskque to get app reviews
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
	valid := validation.Validation{}
	valid.Required(iosapp.AppID, "app_id")
	valid.Numeric(iosapp.AppID, "app_id")
	valid.Numeric(iosapp.Region, "region")
	regex_str := "^http"
	re, err := regexp.Compile(regex_str)
	valid.Match(iosapp.WebhookURL, re, "webhook_url")
	if valid.HasErrors() {
		for _, err := range valid.Errors {
			log.Println(err.Key, err.Message)
			return nil, errors.New(err.Key + " " + err.Message)
		}
	}
	return &iosapp, err
}
