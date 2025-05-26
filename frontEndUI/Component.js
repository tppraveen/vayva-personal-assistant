sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "frontEndUI/model/models",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/json/JSONModel",
	'sap/ui/core/BusyIndicator'
], function(UIComponent, Device, models, ODataModel, JSONModel,BusyIndicator) {
    "use strict";
    var nbId;
    return UIComponent.extend("frontEndUI.Component", {
        metadata: {
            manifest: "json"
        },
        init: function() { 
            // Call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // Enable routing
            this.getRouter().initialize();

            // Set the device model
            this.setModel(models.createDeviceModel(), "device");

            // Example: oCMSToolModel with default structure
 

            const oGlobalModelData = {
                LoginView: {},
                HomeView: {}
               
            };

            const oGlobalModel = new sap.ui.model.json.JSONModel(oGlobalModelData);
            sap.ui.getCore().setModel(oGlobalModel, "oGlobalModel");

            



        },
        
		
    });
});