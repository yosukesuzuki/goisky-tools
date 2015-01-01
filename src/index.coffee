document.addEventListener "DOMContentLoaded", (event) ->
  console.log "DOM fully loaded and parsed"
  IOSApp()
  return

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
