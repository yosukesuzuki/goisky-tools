#!/bin/sh
echo "running go get to fetch dependencies..."
go get github.com/astaxie/beego
go get github.com/astaxie/beegae
echo "dependencies fetched."
exit 0
