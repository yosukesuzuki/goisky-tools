system = require 'system'

# load global settings
settings = require '../helpers/settings'

casper.test.begin 'test ios app api', 3, (test) ->

  casper.thenOpen settings.baseURL() + "/admin/api/v1/iosapp", ->
    test.assertHttpStatus 200
  #   jsonData = JSON.parse(@getPageContent())
  #   test.assertEqual jsonData.items[0].title, "title1", "title of the first entity should be title1"
  #   test.assertEqual jsonData.items[1].title, "title2", "title of the first entity should be title2"


  # add entity by post
  casper.thenOpen settings.baseURL() + "/admin/api/v1/iosapp",
    method: "post"
    data:{
      app_id: "app_id1"
      title: "title1"
      webhook_url: "http://hoge.com/xxxxx"
      content: "foobar"
    }
  , ->
    @echo "POST request has been sent."
    test.assertHttpStatus 200
    @echo @getPageContent()

  # add entity by post
  casper.thenOpen settings.baseURL() + "/admin/api/v1/iosapp",
    method: "post"
    data:
      app_id: "app_id2"
      title: "title2"
      webhook_url: "http://hoge.com/xxxxx"
      content: "foobar"
  , ->
    @echo "POST request has been sent."
    test.assertHttpStatus 200
    @echo @getPageContent()

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
