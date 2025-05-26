sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
  "sap/ui/core/routing/History"
], function(Controller, MessageToast, History) {
  "use strict";

  return Controller.extend("frontEndUI.controller.Login", {

    onLoginPress: function() {
      var oView = this.getView();
      var sUsername = oView.byId("username").getValue();
      var sPassword = oView.byId("password").getValue();

      if (!sUsername || !sPassword) {
        MessageToast.show("Please enter username and password");
        return;
      }

      // AJAX login call
      $.ajax({
        url: "/users/userlogin",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          username: sUsername,
          password: sPassword
        }),
        success: function(oData) {
          MessageToast.show("Login successful!");
          // Navigate to homepage
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.navTo("homepage");
        }.bind(this),
        error: function(err) {
          MessageToast.show("Invalid login credentials");
        }
      });
    }

  });
});
