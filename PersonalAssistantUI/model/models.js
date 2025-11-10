sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
], 
function (JSONModel, Device) {
    "use strict";

    return {
        /**
         * Provides runtime info for the device the UI5 app is running on as JSONModel
         */
        createDeviceModel: function () {
            var oModel = new JSONModel(Device);
            oModel.setDefaultBindingMode("OneWay");
            return oModel;
        },
        getApplicationModel: function () {
            const oGlobalModelData = {
                // Application Configuration 
                ApplicationConfigurations:{
                    isApplicationDetailsLoaded :false,
                    isUserDetailsLoaded :false,
                    showPilotAIButton:true,
                    showCompanyDetailsonNav:true,
                    showThemeChange:true,
                    messageStrip:{
                        showMessageStrip:false,
                        text:"",
                        type:"",
                        showIcon:"",
                        showCloseButton:""
                    }
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
                        { image: "/image/img2.png", text: "Welcome Carousel Invite Friend"  },
                        { image: "/image/img32.jpg", text: "Tablet Offer"  }
                    ],
                    OverViewTiles:{
                        dailyRoutine:{
                            lastEntryDateTime:"Today 12:10 PM"
                        },
                        Expense:{
                            lastEntryDateTime:"Today 12:10 PM",
                            totalExpense:"10900"
                        },
                    }
                }
                
                ,
            };
            return oGlobalModelData;
        },
         
    };

});