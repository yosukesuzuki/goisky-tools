system = require 'system'

settings = require '../helpers/settings'

casper.test.begin 'login to admin page', 1, (test) ->
  casper.start settings.baseURL() + "/admin/",->
    @echo settings.baseURL()
    test.assertHttpStatus 200
    if settings.env() is "localdev"
      @echo @getTitle()
      currentUrl = @getCurrentUrl()
      if currentUrl.match(/login/)
        @click "#admin"
        @thenClick "#submit-login"
    else if settings.env() is "gaedev"
      #fill id and password passed from cli
      user_id = casper.cli.get("user_id")
      user_password = casper.cli.get("user_password")
      @fill "form#gaia_loginform",
        Email: user_id
        Passwd:user_password
      , true

  casper.run ->
    do test.done
