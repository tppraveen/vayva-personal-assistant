sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
  "use strict";

  return Controller.extend("sap.ui.demo.hello.controller.App", {
    onInit: function () {
      var oModel = new JSONModel();
      this.getView().setModel(oModel);

      // Fetch hello message from backend
      fetch("/hello")
        .then(response => response.json())
        .then(data => {
          oModel.setData(data);
        })
        .catch(err => {
          oModel.setData({ message: "Failed to load message from backend" });
          console.error(err);
        });
    }
  });
});
