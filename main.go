package main

import (
	"controllers"
	"github.com/astaxie/beegae"
)

func init() {
	beegae.TemplateLeft = "{{{"
	beegae.TemplateRight = "}}}"
	beegae.Router("/admin/task/iosapp/getappreview/:app_id", &controllers.IOSAppController{}, "get:GetAppReview")
	beegae.Router("/admin/task/iosapp/getreviews", &controllers.IOSAppController{}, "*:GetReviews")
	beegae.Router("/admin/api/v1/iosapp/:key_name", &controllers.IOSAppController{}, "get:GetEntity;patch:UpdateEntity;delete:DeleteEntity")
	beegae.Router("/admin/api/v1/iosapp", &controllers.IOSAppController{})
	beegae.Router("/admin/form", &controllers.AdminFormController{})
	beegae.Router("/admin/", &controllers.AdminController{})
	beegae.Router("/", &controllers.MainController{})
	beegae.Run()
}
