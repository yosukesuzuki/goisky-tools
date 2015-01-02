package main

import (
	"controllers"
	"github.com/astaxie/beegae"
)

func init() {
	beegae.TemplateLeft = "{{{"
	beegae.TemplateRight = "}}}"
	beegae.Router("/admin/api/v1/iosapp/:key_name", &controllers.IOSAppController{}, "get:GetEntity;patch:UpdateEntity;delete:DeleteEntity")
	beegae.Router("/admin/api/v1/iosapp", &controllers.IOSAppController{})
	beegae.Router("/admin/form", &controllers.AdminFormController{})
	beegae.Router("/admin/", &controllers.AdminController{})
	beegae.Router("/", &controllers.MainController{})
	beegae.Run()
}
