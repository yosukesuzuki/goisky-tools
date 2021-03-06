// Beego (http://beego.me/)
// @description beego is an open-source, high-performance web framework for the Go programming language.
// @link        http://github.com/astaxie/beego for the canonical source repository
// @license     http://github.com/astaxie/beego/blob/master/LICENSE
// @authors     Unknwon

package controllers

import (
	"github.com/yosukesuzuki/beegae"
)

type AdminController struct {
	beegae.Controller
}

func (this *AdminController) Get() {
	this.Layout = "layout.html"
	this.TplNames = "admin_form.html"
}

type AdminFormController struct {
	beegae.Controller
}

func (this *AdminFormController) Get() {
	this.Layout = "layout.html"
	this.TplNames = "admin_form.html"
}
