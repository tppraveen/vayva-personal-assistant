
sap.ui.define([
	"PersonalAssistantUI/controller/BaseController",
	"PersonalAssistantUI/model/formatter",
	'sap/ui/core/BusyIndicator'
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (BaseController, formatter, BusyIndicator) {
		"use strict";
		let oRouter, oGlobalModel;


		return BaseController.extend("PersonalAssistantUI.controller.Login", {
			formatter: formatter,
			onInit: function () {
				this.oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				oRouter = sap.ui.core.UIComponent.getRouterFor(this);
 				this.getView().setModel(this.getOwnerComponent().getModel("oGlobalAIModel"),"oGlobalAIModel");
				oGlobalModel = this.getView().getModel("oGlobalAIModel")
				BusyIndicator.show(0);

				this.getApplicationDetails();
				const oRoute = oRouter.getRoute("Login");
				if (oRoute) {
					oRoute.attachMatched(this.onObjectMatched, this);
				}
			},
			onObjectMatched: function () {
  				BusyIndicator.hide();
			},
			
			getApplicationDetails:function(){
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

			onLoginPress: function () {
				this.getUserDetailsforUser();
				this.getNotificationforUser();
				const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("Home");
				return
			},
			getUserDetailsforUser:function(){
 				var oUserDetailsData = {
                    initial:"PK",
                    username: "praveenKumars",
                    firstName: "praveen Kumar",
                    lastName: "T P",
                    lastLogin: "26/10/2025 10:00AM",                   
                    selectedTheme: "sap_horizon",
					navigationMenus:[
						{
							"title": "Expenses",
							"icon": "sap-icon://money-bills",
							"expanded": false,
							"key": "expenses"
						},
						{
							"title": "Expense Tracker",
							"icon": "sap-icon://activity-items",
							"expanded": false,
							"key": "expenseTracker"
						},
						{
							"title": "Medicine History",
							"icon": "sap-icon://pharmacy",
							"expanded": false,
							"key": "medicineHistory"
						},
						{
							"title": "Calendar",
							"icon": "sap-icon://calendar",
							"expanded": false,
							"key": "calendar"
						}

					]
                }
				oGlobalModel.setProperty("/userDetails",oUserDetailsData)
				oGlobalModel.setProperty("/ApplicationConfigurations/isUserDetailsLoaded",true)
				oGlobalModel.refresh(true);
			},
			
			getNotificationforUser:function(){
				var oNotificationData =[
					 {
                            title: "New order (#2525)",
                            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                            datetime: "1 hour ago",
                            unread: true,
                            priority: "None",
                            authorName: "Jean Doe",
                              
                        },
                        {
                            title: "New order (#2524) without actions",
                            description: "Short description",
                            datetime: "3 days ago",
                            unread: true,
                            priority: "High",
                            authorName: "Office Notification",
                         },
                        {
                            title: "New order (#2522) Medium priority",
                            description: "With medium priority and no buttons",
                            datetime: "2 days ago",
                            unread: true,
                            priority: "Medium",
                            authorName: "John Smith", 
                        }
                ];
				oGlobalModel.setProperty("/userDetails/UserNotifications",oNotificationData)
				oGlobalModel.refresh(true);
			},

		});
	});