document.addEventListener "DOMContentLoaded", (event) ->
  console.log "DOM fully loaded and parsed"
  modelName = location.pathname.split("/")[2]
  switch modelName
    when "form" then BuildForm()
    when "iosapp" then IOSApp()
  return

BuildForm = ->
  console.log "hi"
  modelName = location.hash.split("/")[1]
  schema = Schemas[modelName]
  console.log schema
  formVue = new Vue(
    el: "#form-container"
    data:
      formTitle: schema.formTitle
      items: schema.schema
  )


IOSApp = ->
  request = window.superagent
  request.get "/admin/api/v1/iosapp", (res) ->
    items = res.body
    listVue = new Vue(
      el: "#content-list-table"
      data:
        items: items.items
    )

Vue.filter "dateFormat", (value) ->
  value = value.replace(/T/, " ")
  localTime = moment.utc(value.slice(0, 16)).toDate()
  localTime = moment(localTime).format("YYYY-MM-DD HH:mm (Z)")
  localTime

Vue.filter "dateFormatUTC", (value) ->
  value = value.replace(/T/, " ")
  value.slice 0, 16

IOSAppSchema = [
  {
    fieldTitle: "Application ID"
    fieldName:"app_id"
    fieldType:"inputtext"
  }
  {
    fieldTitle: "Title"
    fieldName:"title"
    fieldType:"inputtext"
  }
  {
    fieldTitle: "Webhook URL"
    fieldName:"webhook_url"
    fieldType:"inputtext"
  }
  {
    fieldTitle: "Description"
    fieldName:"content"
    fieldType:"textarea"
  }
  {
    fieldTitle: "Region"
    fieldName:"region"
    fieldType:"regionselect"
  }
]

Schemas =
  iosapp:
    schema:IOSAppSchema
    formTitle:"AppStore App settings"
    formDescription:"set the app id of your application"


