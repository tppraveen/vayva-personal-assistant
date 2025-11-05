sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "PersonalAssistantUI/model/models",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/json/JSONModel",
	'sap/ui/core/BusyIndicator'
], function(UIComponent, Device, models, ODataModel, JSONModel,BusyIndicator) {
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
 
            const oGlobalModelData = {
                globalAppConfig:{
                    isApplicationDataLoaded :false,
                    isUserDetailsLoaded :false
                },
                applicationDetails:{
                    applicationName:"",
                    logoPath:"",
                    footerName:"",
                    companyInfo: {
                    companyLogoPath:"",
                        "name": "PRAV Technovations",
                        "address": "54,west Street,Thandampalayam",
                        "website": "https://www.praveen.com"
                    }

                },
                dashboard: {
                    tiles:[]
                },
                Notifications: [ ],
                userDetails: {
                    initial:"",
                    username: "",
                    firstName: "",
                    lastName: "",
                    lastLogin: "",                   
                    selectedTheme: "sap_horizon",
                    navItems:[ ],
                    assignedMenu:[ ]
                },
                menuBar:{
                    menuVisible:false
                }
            };



            const oGlobalModelData2 = {
                applicationDetails:{
                    logoPath:"image/pravzyraally.png",
                    footerName:"PRVN Group of Enterprises"
                },
                dashboard: {
                    tiles:[]
                },
                Notifications: [
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
                ],
                userDetails: {
                    initial:"",
                    username: "",
                    name: "",
                    lastLogin: "",                   
                    selectedTheme: "sap_horizon",
                    assignedMenu:[ ]
                },
                menuBar:{
                    menuVisible:true
                }
            };

            const oGlobalModel = new sap.ui.model.json.JSONModel(oGlobalModelData);
            sap.ui.getCore().setModel(oGlobalModel, "oGlobalAIModel");
            this.setModel(oGlobalModel, "oGlobalAIModel");

 
        },
        
		
    });
});