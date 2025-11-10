
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
				if (oGlobalModel.getProperty("/ApplicationConfigurations/isUserDetailsLoaded")) {
					oRouter.navTo("Home")
				}

 				const oRoute = oRouter.getRoute("Login");
				if (oRoute) {
					oRoute.attachMatched(this.onObjectMatched, this);
				}
			},
			onObjectMatched: function () {
  				BusyIndicator.hide();
			},
			 
			onLoginPress: function () {
				this.getUserDetailsforUser();
				this.getNotificationforUser();
				const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("Home");
				return
			},
			getUserDetailsforUser:function(){
				console.log("Call 2 - Login cont--  userDetails by inputs");

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

				localStorage.setItem("authToken", "Yes");
				localStorage.setItem("AIUserDetailsInfo", JSON.stringify(oUserDetailsData));
 
				oGlobalModel.refresh(true);
			},
			
			getNotificationforUser:function(){
				console.log("Call 2 - Login cont-- combine into 1 service  user - notifications Details by user");
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