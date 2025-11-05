
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
 				BusyIndicator.hide();
				const oRoute = oRouter.getRoute("Login");
				if (oRoute) {
					oRoute.attachMatched(this.onObjectMatched, this);
				}
			},
			onObjectMatched: function () {
				sap.ui.getCore().getModel("oGlobalAIModel").setProperty("/menuBar/menuVisible", false);
			},
			onLoginPress: function () {
				const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				this.getUserDetailsforUser();
				this.getNotificationforUser();
				oRouter.navTo("Home");
				return
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
						authorPicture: "test-resources/sap/m/images/Woman_04.png",
						buttons: [
							{ text: "Accept All" },
							{ text: "Reject All" }
						]
					},
					{
						title: "New order (#2524) without actions",
						description: "Short description",
						datetime: "3 days ago",
						unread: true,
						priority: "High",
						authorName: "Office Notification",
						authorPicture: "sap-icon://group"
					},
					{
						title: "New order (#2523) Long title",
						description: "Another short description",
						datetime: "3 days ago",
						unread: false,
						priority: "High",
						authorName: "Patricia Clark",
						authorInitials: "PC",
						authorAvatarColor: "Accent8",
						buttons: [
							{ text: "Accept" },
							{ text: "Reject" }
						]
					},
					{
						title: "New order (#2522) Medium priority",
						description: "With medium priority and no buttons",
						datetime: "2 days ago",
						unread: true,
						priority: "Medium",
						authorName: "John Smith",
						authorInitials: "JS",
						authorAvatarColor: "Accent4"
					},
					{
						title: "New order (#2521) Low priority",
						description: "Just a notification without buttons",
						datetime: "1 week ago",
						unread: false,
						priority: "Low",
						authorName: "Alice Brown",
						authorPicture: "test-resources/sap/m/images/female_BaySu.jpg"
					}
                ];
				oGlobalModel.setProperty("/applicationDetails/Notifications",oNotificationData)
				oGlobalModel.refresh(true);
			},
			getUserDetailsforUser:function(){
				//oGlobalModel.setProperty("/applicationDetails/globalAppConfig/isUserDetailsLoaded",true)
				var oUserDetailsData = {
                    initial:"PK",
                    username: "praveenKumars",
                    firstName: "praveen Kumar",
                    lastName: "T P",
                    lastLogin: "26/10/2025 10:00AM",                   
                    selectedTheme: "sap_horizon",
					navItems:[
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

],
                    assignedMenu:[{
							header: "Expenses",
							subheader: "Manage your spending",
							value: 200,
							valueColor: "Good",
							indicator: "Up",
							scale: "Amount",
							state: "Loaded",
							tileClass: "sapUiTinyMargin genericTileStyle"
						},
						{
							header: "Expense Tracker",
							subheader: "Track your financial habits",
							value: 15,
							valueColor: "Neutral",
							indicator: "None",
							scale: "Track",
							state: "Loaded",
							tileClass: "sapUiTinyMargin genericTileStyle"
						},
						{
							header: "Medicine History",
							subheader: "View your medicine records",
							value: 8,
							valueColor: "Good",
							indicator: "Up",
							scale: "Medications",
							state: "Loaded",
							tileClass: "sapUiTinyMargin genericTileStyle"
						},
						{
							header: "Calendar",
							subheader: "View your schedule",
							value: 3,
							valueColor: "Good",
							indicator: "Up",
							scale: "Appointments",
							state: "Loaded",
							tileClass: "sapUiTinyMargin genericTileStyle"
						} 
					]
                }
				oGlobalModel.setProperty("/userDetails",oUserDetailsData)
				oGlobalModel.setProperty("/globalAppConfig/isUserDetailsLoaded",true)
				oGlobalModel.refresh(true);
			},

			getApplicationDetails:function(){
 				oGlobalModel.setProperty("/globalAppConfig/isApplicationDataLoaded",true)
				oGlobalModel.setProperty("/applicationDetails/logoPath","image/pravzyraally.png")
				oGlobalModel.setProperty("/applicationDetails/companyInfo/companyLogoPath","image/prav.png")
				
				oGlobalModel.setProperty("/applicationDetails/footerName","PRVN Group of Enterprises")
				oGlobalModel.setProperty("/applicationDetails/applicationName","ZYRA AI")
				oGlobalModel.refresh(true);
			},
		});
	});