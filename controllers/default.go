// Beego (http://beego.me/)
// @description beego is an open-source, high-performance web framework for the Go programming language.
// @link        http://github.com/astaxie/beego for the canonical source repository
// @license     http://github.com/astaxie/beego/blob/master/LICENSE
// @authors     Unknwon

package controllers

import (
	"github.com/yosukesuzuki/beegae"
)

type MainController struct {
	beegae.Controller
}

func (this *MainController) Get() {
	this.Layout = "layout.html"
	this.TplNames = "index.html"
}
