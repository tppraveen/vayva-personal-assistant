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
            
            this.fnInitlizeGlobalModel();
        },
        fnInitlizeGlobalModel:function(){
            const oGlobalModelData = {
                // Application Configuration 
                ApplicationConfigurations:{
                    isApplicationDetailsLoaded :false,
                    isUserDetailsLoaded :false,
                    showPilotAIButton:true,
                    showCompanyDetailsonNav:true,
                    showThemeChange:true,
                }, 
                // Application & Company Details Configuration 
                applicationDetails:{
                    applicationName:"",
                    footerName:"",
                    logoPath:"",
                    companyInfo: {
                        companyLogoPath:"",
                        name: "",
                        address : "",
                        website: ""
                    }
                },
                // Logged In User Details  
                userDetails: {
                    initial:"",
                    username: "",
                    firstName: "",
                    lastName: "",
                    lastLogin: "",                   
                    selectedTheme: "sap_horizon",
                    navigationMenus:[],
                    UserNotifications: []
                }, 
                DashboardPage: {
                    FeedsCarouselToogle:true,
                    upcomingRemainders:[] ,
                    monthlyExpenseChartData:[],
                    WeeklyExpenseChartData:[
                        { value: 50, label: "Q1", color: "Error" },
                        { value: 80, label: "Q2", displayValue: "80M", color: "Error" },
                        { value: -20, label: "Q3", color: "Error" },
                        { value: 60, label: "Q4", displayValue: "avg", color: "Neutral" },
                        { value: 55, label: "Q5", color: "Neutral" }
                    ],
                    healthStatusData: {
                        minValue: 0,
                        maxValue: 40,
                        lists: [
                            { title: "Water", color: "Good", displayValue: "1L of 10L", value: 30 },
                            { title: "Sleep", color: "Good", displayValue: "5hr of 8hr", value: 20 },
                            { title: "Steps", color: "Good", displayValue: "1000 of 8000", value: 10 }
                        ]
                    },
                    Tiles:[
                        { image: "/image/img1.png", text: "Expense Tracker by AI"  },
                        { image: "/image/img4demo.jpg", text: "It's done!"  },
                        { image: "/image/img22.jpg", text: "Welcome Carousel Invite Friend"  },
                        { image: "/image/img32.jpg", text: "Tablet Offer"  }
                     ]
                }
                
                ,
            };
 
            const oGlobalModel = new sap.ui.model.json.JSONModel(oGlobalModelData);
            sap.ui.getCore().setModel(oGlobalModel, "oGlobalAIModel");
            this.setModel(oGlobalModel, "oGlobalAIModel");
        }
		
    });
});