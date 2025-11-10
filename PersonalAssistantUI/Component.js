sap.ui.define([
	"PersonalAssistantUI/controller/BaseController",
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "PersonalAssistantUI/model/models",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/json/JSONModel",
	'sap/ui/core/BusyIndicator',
    	"sap/m/MessageBox",
	"sap/m/MessageToast",
    
], function(BaseController,UIComponent, Device, models, ODataModel, JSONModel,BusyIndicator,MessageBox, MessageToast) {
    "use strict";
    var nbId;
    return UIComponent.extend("PersonalAssistantUI.Component", {
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
            
            this.fnInitlizeGlobalModel(); 
            this.getApplicationDetails()
        },
        
        fnInitlizeGlobalModel:function(){
            let oGlobalModelData = models.getApplicationModel()
            console.log(oGlobalModelData)
            const oGlobalModel = new sap.ui.model.json.JSONModel(oGlobalModelData);
            sap.ui.getCore().setModel(oGlobalModel, "oGlobalAIModel");
            this.setModel(oGlobalModel, "oGlobalAIModel");
        },
        fnCheckUserLoginData:function(sToken){
            if (sToken) {
                // validate token or directly load
                var oUserDetailsData = JSON.parse(localStorage.getItem("AIUserDetailsInfo")); 
                let oGlobalModel = this.getModel("oGlobalAIModel")

                oGlobalModel.setProperty("/userDetails",oUserDetailsData)
				oGlobalModel.setProperty("/ApplicationConfigurations/isUserDetailsLoaded",true)
            } else {
                this.getRouter().navTo("Login");
            }
        },
        
			getApplicationDetails:function(){                
                var sToken = localStorage.getItem("authToken");
                console.log("Call 1 - component js --  GetApplicationDetails with existing token for session");

                this.fnCheckUserLoginData(sToken); //inside sucess/error need to cll


                // inside success -- if system mesage for all users
                // if messagebox info
                // MessageBox.information("Your booking will be reserved for 24 hours. \n "+
                //    " Your booking will be reserved for 24 hours. \n ");

                // if messagebox info
                var msg = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy\r\n eirmod.';
			    // MessageToast.show(msg);


                let oGlobalModel = this.getModel("oGlobalAIModel")
                // if messagebox info
                oGlobalModel.setProperty("/ApplicationConfigurations/messageStrip/showMessageStrip",false);
                oGlobalModel.setProperty("/ApplicationConfigurations/messageStrip/text","Mesge Strip Diplaying here");
                oGlobalModel.setProperty("/ApplicationConfigurations/messageStrip/type","Error");
                oGlobalModel.setProperty("/ApplicationConfigurations/messageStrip/showIcon",true);
                oGlobalModel.setProperty("/ApplicationConfigurations/messageStrip/showCloseButton",true);
				





 				oGlobalModel.setProperty("/ApplicationConfigurations/isApplicationDetailsLoaded",true)
				oGlobalModel.setProperty("/applicationDetails/logoPath","image/pravzyraally.png")
				oGlobalModel.setProperty("/applicationDetails/companyInfo/companyLogoPath","image/prav.png")
				oGlobalModel.setProperty("/applicationDetails/companyInfo/name","PRAV Technovations")
				oGlobalModel.setProperty("/applicationDetails/companyInfo/address","54,west Street,Thandampalayam")
				oGlobalModel.setProperty("/applicationDetails/companyInfo/website","https://www.praveen.com")
				 
				oGlobalModel.setProperty("/applicationDetails/footerName","PRVN Group of Enterprises")
				oGlobalModel.setProperty("/applicationDetails/applicationName","ZYRA AI")
				oGlobalModel.refresh(true);
			},
		
    });
});