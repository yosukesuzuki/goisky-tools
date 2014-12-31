document.addEventListener "DOMContentLoaded", (event) ->
  console.log "DOM fully loaded and parsed"
  IOSApp()
  return

IOSApp = ->
  xhr = new XMLHttpRequest()
  xhr.open "GET", "/admin/api/v1/iosapp", true
  xhr.onload = (e) ->
    # console.log xhr.responseText  if @status is 200
    items = JSON.parse(xhr.responseText)
    console.log items
    listVue = new Vue(
      el: "#content-list-table"
      data:
        items: items.items
    )
    return

  xhr.send()
