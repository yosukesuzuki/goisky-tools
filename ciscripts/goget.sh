#!/bin/sh
echo "running go get to fetch dependencies..."
go get github.com/PuerkitoBio/goquery
go get github.com/yosukesuzuki/beegae
echo "dependencies fetched."
exit 0
