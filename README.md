Goisky Tools
==========

[![Build Status](https://travis-ci.org/yosukesuzuki/goisky-tools.svg?branch=master)](https://travis-ci.org/yosukesuzuki/goisky-tools)

# version
0.3

# tools
- AppStore review notification
- Blobstore image uploader


# setup
## install go
for mac user

```
$ brew install go
```
## install google cloud sdk
see this document
https://cloud.google.com/sdk/#Quick_Start

## get go libraries
```
$ go get github.com/yosukesuzuki/beegae
$ go get github.com/PuerkitoBio/goquery
```

## clone this repository
```
$ git clone git@github.com:yosukesuzuki/goisky-tools.git
```

## setup gulp for coffee script compile
if you want to customize frontend, see this document(Japanese)
http://qiita.com/mizchi/items/10a8e2b3e6c2c3235e61

## run local server
```
$ goapp serve
```

Then access to localhost:8080 from your browser

## run local e2e test
```
$ casperjs --pre=caspertests/helpers/adminlogin.coffee test caspertests/tests
```

## get your application id
go -> https://appengine.google.com/ and create your application id

## edit app.yaml
open app.yaml and edit the first line into your application id

## deploy
```
$ goapp deploy
```

# how to use tools
## AppStore review notification
open /admin/ and click go setting

![Goisky_Tools_on_GAE_Go.png](https://qiita-image-store.s3.amazonaws.com/0/45686/c3db4890-c40d-a42e-edf8-45a0c9fe8935.png "Goisky_Tools_on_GAE_Go.png")

click Create new entity button
![Goisky_Tools_on_GAE_Go.png](https://qiita-image-store.s3.amazonaws.com/0/45686/0aee7755-a3b1-1357-02aa-6c8aa3b56606.png "Goisky_Tools_on_GAE_Go.png")

fill in the form and submit
![Goisky_Tools_on_GAE_Go.png](https://qiita-image-store.s3.amazonaws.com/0/45686/2c79525a-fbe3-9226-a10f-7997c6abf03e.png "Goisky_Tools_on_GAE_Go.png")



# libraries
## go
- [fork version of beegae](https://github.com/yosukesuzuki/beegae)
- [goquery](https://github.com/PuerkitoBio/goquery)

## javascript
- [superagent](https://github.com/visionmedia/superagent)
- [dropzone](http://www.dropzonejs.com/)
- [lodash](https://lodash.com/)
- [Bootstrap without jQuery](https://github.com/tagawa/bootstrap-without-jquery)

## css
- [bootswatch](http://bootswatch.com/)
