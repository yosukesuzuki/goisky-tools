#!/bin/sh
echo "running go get to fetch dependencies..."
# go get github.com/beego/x2j
# go get github.com/garyburd/redigo/redis
# go get github.com/bradfitz/gomemcache/memcache
# go get github.com/gorilla/websocket
# go get github.com/beego/x2j
# go get github.com/couchbaselabs/go-couchbase
# go get github.com/beego/goyaml2
# go get github.com/lib/pq
goapp get github.com/PuerkitoBio/goquery
# go get github.com/siddontang/ledisdb/config
# go get github.com/siddontang/ledisdb/ledis
# go get github.com/go-sql-driver/mysql
# goapp get github.com/astaxie/beego
goapp get github.com/astaxie/beegae
echo "dependencies fetched."
exit 0
