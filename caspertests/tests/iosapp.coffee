system = require 'system'

# load global settings
settings = require '../helpers/settings'

casper.test.begin 'test ios app api', 7, (test) ->

  casper.thenOpen settings.baseURL() + "/admin/api/v1/iosapp", ->
    test.assertHttpStatus 200

  # add entity by post
  casper.thenOpen settings.baseURL() + "/admin/api/v1/iosapp",
    method: "post"
    data: JSON.stringify({
      app_id:"app_id1"
      title:"title1"
      webhook_url: "http://xxx.xxx/xxxx"
      content: "foobar"
      region: "143462"
    })
    headers:
      "Content-Type": "application/json; charset=utf-8"
  , ->
    @echo "POST request has been sent."
    test.assertHttpStatus 200
    @echo @getPageContent()

  casper.thenOpen settings.baseURL() + "/admin/api/v1/iosapp",
    method: "post"
    data: JSON.stringify({
      app_id:"app_id2"
      title:"title2"
      webhook_url: "http://xxx.xxx/xxxx"
      content: "moo bar"
      region: "143462"
    })
    headers:
      "Content-Type": "application/json; charset=utf-8"
  , ->
    @echo "POST request has been sent."
    test.assertHttpStatus 200
    @echo @getPageContent()

  casper.thenOpen settings.baseURL() + "/admin/api/v1/iosapp/app_id2",
    method: "delete"
    headers:
      "Content-Type": "application/json; charset=utf-8"
  , ->
    @echo "DELETE request has been sent."
    test.assertHttpStatus 200
    @echo @getPageContent()

  casper.thenOpen settings.baseURL() + "/admin/api/v1/iosapp",
    method: "post"
    data: JSON.stringify({
      app_id:"579581125"
      title:"smart news"
      webhook_url: "http://xxx.xxx/xxxx"
      content: "moo bar"
      region: "143462"
    })
    headers:
      "Content-Type": "application/json; charset=utf-8"
  , ->
    @echo "POST request has been sent."
    test.assertHttpStatus 200
    @echo @getPageContent()

  casper.thenOpen settings.baseURL() + "/admin/task/iosapp/getreviews", ->
    test.assertHttpStatus 200

  casper.thenOpen settings.baseURL() + "/admin/task/iosapp/getappreview/579581125", ->
    test.assertHttpStatus 200

  # casper.thenOpen settings.baseURL() + "/admin/api/v1/iosapp", ->
  #   test.assertHttpStatus 200
  #   jsonData = JSON.parse(@getPageContent())
  #   test.assertEqual jsonData.items[0].title, "title1", "title of the first entity should be title1"
  #   test.assertEqual jsonData.items[1].title, "title2", "title of the first entity should be title2"

  # casper.thenOpen settings.baseURL() + "/admin/api/v1/iosapp/app_id1",
  #   method: "delete"
  # , ->
  #   @echo "DELETE request has been sent."
  #   test.assertHttpStatus 200
  #   #jsonData = JSON.parse(@getPageContent())
  #   @echo @getPageContent()

  casper.run ->
    do test.done
