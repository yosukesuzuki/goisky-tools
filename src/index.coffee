document.addEventListener "DOMContentLoaded", (event) ->
  console.log "DOM fully loaded and parsed"
  pathName = location.pathname.split("/")[2]
  switch pathName
    when "",undefined
      BuildAppList()
    when "form"
      BuildForm()
      window.onhashchange = BuildForm
  return

BuildAppList =->
  items = []
  for key,value of schemas
    items.push value
  listVue = new Vue(
    el: "#form-container"
    template: "#appList"
    data:
      items: items
  )

BuildForm = ->
  hashArr = location.hash.split("/")
  modelName = hashArr[1]
  crudMethod = hashArr[2]
  keyName = hashArr[3]
  schema = schemas[modelName]
  switch crudMethod
    when "update" then BuildFormUpdate(schema,keyName)
    when "list" then BuildFormList(schema)

SetPostData = (items) ->
  returnObject = {}
  for v in items
    returnObject[v.fieldName] = v.fieldValue
  return returnObject

BuildFormUpdate = (schema,keyName) ->
  formVue = new Vue(
    el: "#form-container"
    template: "#formTemplate"
    data:
      formTitle: schema.formTitle
      items: schema.schema
    created: () ->
      if keyName
        request = window.superagent
        request.get schema.apiEndpoint+"/"+keyName, (res) ->
          data = res.body
          for v in formVue.$data.items
            v.fieldValue = data[v.fieldName]
    methods:
      cancel: (e) ->
        formVue.$destroy()
        location.hash = "/"+schema.modelName+"/list"
      submitUpdate: (e) ->
        e.preventDefault()
        this.$event.toElement.innerHTML = "..loading"
        this.$event.toElement.setAttribute("disabled","disabled")
        request = window.superagent
        request.post(schema.apiEndpoint)
          .send(SetPostData(@$data.items))
          .set("Accept", "application/json")
          .end (error, res) ->
            unless error?
              items = res.body
              console.log items
              location.hash = "/"+schema.modelName+"/list"
              location.reload()
  )

BuildFormList = (schema) ->
  listVue = new Vue(
    el: "#form-container"
    template: "#listTemplate"
    data:
      formTitle: schema.formTitle
      formDescription: schema.formDescription
      modelName: schema.modelName
      items: []
    methods:
      executeTask: (e) ->
        request = window.superagent
        request.get schema.taskEndpoint, (res) ->
          console.log "done"
          
      deleteEntity: (e) ->
        if window.confirm('Delete this entity?')
          keyName = e.targetVM.$data.app_id
          request = window.superagent
          request.del schema.apiEndpoint+"/"+keyName, (res) ->
            items = res.body
            listVue.$data.items.$remove(e.targetVM.$index)
  )
  request = window.superagent
  request.get schema.apiEndpoint, (res) ->
    items = res.body
    listVue.$data.items = items.items
  if document.querySelector("#imagetarget")
    request.get "/admin/blobstoreimage/uploadurl", (res) ->
      blobDropzone = new Dropzone("div#imagetarget",
        url: res.body.uploadurl
        uploadMultiple: false
      )
      blobDropzone.on "complete", (file) ->
        request.get "/admin/blobstoreimage/handler",(res) ->
          request.get schema.apiEndpoint, (res) ->
            items = res.body
            listVue.$data.items = items.items

Vue.filter "dateFormat", (value) ->
  value = value.replace(/T/, " ")
  localTime = moment.utc(value.slice(0, 16)).toDate()
  localTime = moment(localTime).format("YYYY-MM-DD HH:mm (Z)")
  localTime

Vue.filter "dateFormatUTC", (value) ->
  value = value.replace(/T/, " ")
  value.slice 0, 16

appStores =
  Argentina: 143505
  Australia: 143460
  Belgium: 143446
  Brazil: 143503
  Canada: 143455
  Chile: 143483
  China: 143465
  Colombia: 143501
  "Costa Rica": 143495
  Croatia: 143494
  "Czech Republic": 143489
  Denmark: 143458
  Deutschland: 143443
  "El Salvador": 143506
  Espana: 143454
  Finland: 143447
  France: 143442
  Greece: 143448
  Guatemala: 143504
  "Hong Kong": 143463
  Hungary: 143482
  India: 143467
  Indonesia: 143476
  Ireland: 143449
  Israel: 143491
  Italia: 143450
  Korea: 143466
  Kuwait: 143493
  Lebanon: 143497
  Luxembourg: 143451
  Malaysia: 143473
  Mexico: 143468
  Nederland: 143452
  "New Zealand": 143461
  Norway: 143457
  Osterreich: 143445
  Pakistan: 143477
  Panama: 143485
  Peru: 143507
  Phillipines: 143474
  Poland: 143478
  Portugal: 143453
  Qatar: 143498
  Romania: 143487
  Russia: 143469
  "Saudi Arabia": 143479
  "Schweiz/Suisse": 143459
  Singapore: 143464
  Slovakia: 143496
  Slovenia: 143499
  "South Africa": 143472
  "Sri Lanka": 143486
  Sweden: 143456
  Taiwan: 143470
  Thailand: 143475
  Turkey: 143480
  "United Arab Emirates": 143481
  "United Kingdom": 143444
  "United States": 143441
  Venezuela: 143502
  Vietnam: 143471
  Japan: 143462
  "Dominican Republic": 143508
  Ecuador: 143509
  Egypt: 143516
  Estonia: 143518
  Honduras: 143510
  Jamaica: 143511
  Kazakhstan: 143517
  Latvia: 143519
  Lithuania: 143520
  Macau: 143515
  Malta: 143521
  Moldova: 143523
  Nicaragua: 143512
  Paraguay: 143513
  Uruguay: 143514

appStoreOptions = []
for key,value of appStores
  appStoreOptions.push({text:key,value:value})

iOSAppSchema = [
  {
    fieldTitle: "Application ID"
    fieldName:"app_id"
    fieldType:"inputtext"
    fieldValue:""
  }
  {
    fieldTitle: "Title"
    fieldName:"title"
    fieldType:"inputtext"
    fieldValue:""
  }
  {
    fieldTitle: "Webhook URL"
    fieldName:"webhook_url"
    fieldType:"inputtext"
    fieldValue:""
  }
  {
    fieldTitle: "Icon URL"
    fieldName:"icon_url"
    fieldType:"inputtext"
    fieldValue:""
  }
  {
    fieldTitle: "Description"
    fieldName:"content"
    fieldType:"textarea"
    fieldValue:""
  }
  {
    fieldTitle:"Region"
    fieldName:"region"
    fieldType:"select"
    options: appStoreOptions
    fieldValue:""
  }
]

blobStoreImageSchema = [
  {
    fieldTitle: "Title"
    fieldName:"title"
    fieldType:"inputtext"
    fieldValue:""
  }
  {
    fieldTitle: "Note"
    fieldName:"note"
    fieldType:"inputtext"
    fieldValue:""
  }
  {
    fieldTitle: "Image URL"
    fieldName:"image_url"
    fieldType:"inputtext"
    fieldValue:""
  }
]
schemas =
  iosapp:
    schema:iOSAppSchema
    modelName: "iosapp"
    apiEndpoint: "/admin/api/v1/iosapp"
    taskEndpoint: "/admin/task/iosapp/getreviews"
    formTitle:"AppStore App settings"
    formDescription:"When a review is posted to AppStore, notification is send to your slack channel"
  blobstoreimage:
    schema:blobStoreImageSchema
    modelName: "blobstoreimage"
    apiEndpoint: "/admin/api/v1/blobstoreimage"
    formTitle:"Blob Store Image Management"
    formDescription:"Upload Image to BlobStore and get resizable image by parameter"
