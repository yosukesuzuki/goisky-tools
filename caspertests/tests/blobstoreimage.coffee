system = require 'system'

# load global settings
settings = require '../helpers/settings'

casper.test.begin 'test blobstoreimage app api', 9, (test) ->

  casper.thenOpen settings.baseURL() + "/admin/api/v1/blobstoreimage", ->
    test.assertHttpStatus 200

  # add entity by post
  casper.thenOpen settings.baseURL() + "/admin/api/v1/blobstoreimage",
    method: "post"
    data: JSON.stringify({
      blob_key:"fZdJpLzS57RBk2vKsraiZg=="
      title:"title1"
      image_url: "//localhost:8080/_ah/img/fZdJpLzS57RBk2vKsraiZg=="
      note: "hoge"
    })
    headers:
      "Content-Type": "application/json; charset=utf-8"
  , ->
    @echo "POST request has been sent."
    test.assertHttpStatus 200
    @echo @getPageContent()
    jsonData = JSON.parse(@getPageContent())
    test.assertEquals(jsonData.key_name,"fZdJpLzS57RBk2vKsraiZg==")

  casper.thenOpen settings.baseURL() + "/admin/api/v1/blobstoreimage/fZdJpLzS57RBk2vKsraiZg==", ->
    test.assertHttpStatus 200
    @echo @getPageContent()

  casper.thenOpen settings.baseURL() + "/admin/api/v1/blobstoreimage/fZdJpLzS57RBk2vKsraiZg==",
    method: "delete"
    headers:
      "Content-Type": "application/json; charset=utf-8"
  , ->
    @echo "DELETE request has been sent."
    test.assertHttpStatus 200
    @echo @getPageContent()

  casper.thenOpen settings.baseURL() + "/admin/api/v1/blobstoreimage",
    method: "post"
    data: JSON.stringify({
      blob_key:"fZdJpLzS57RBk2vKsraiZg=="
      title:"title1"
      image_url: "//localhost:8080/_ah/img/fZdJpLzS57RBk2vKsraiZg=="
      note: "hoge"
    })
    headers:
      "Content-Type": "application/json; charset=utf-8"
  , ->
    @echo "POST request has been sent."
    test.assertHttpStatus 200
    @echo @getPageContent()
    jsonData = JSON.parse(@getPageContent())
    test.assertEquals(jsonData.key_name,"fZdJpLzS57RBk2vKsraiZg==")

  casper.wait 1000, ->
    @echo "I've waited for a second."

  casper.thenOpen settings.baseURL() + "/admin/api/v1/blobstoreimage", ->
    test.assertHttpStatus 200
    @echo @getPageContent()
    jsonData = JSON.parse(@getPageContent())
    test.assertEquals(jsonData.items[0].key_name,"fZdJpLzS57RBk2vKsraiZg==")

  casper.run ->
    do test.done
