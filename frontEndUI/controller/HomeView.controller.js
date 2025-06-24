//  ============================================================================*
// * OBJECT             : 	CapacityPlanning Controller			                *
// * DESCRIPTION		 : 	This controller contains all Capacity Planning  functions  *
// * AUTHOR			 : 	Praveen Kumar TP								         *
// * DATE				 : 	10-04-2025										     *
// * CHANGE REQUEST     : 							                             *
// * DEVELOPMENT ID	 : 															 *
// * ============================================================================*
// * CHANGE HISTORY LOG															 *
// *=============================================================================*
// * NO	|	DATE		|	NAME		|	CORRECTION TR	|	CHANGE REFERNCE# *
// *=============================================================================*
// *		| 	            | 		        |					|   		     *
// *=============================================================================*

sap.ui.define([
	"frontEndUI/controller/BaseController",
	"sap/ui/core/mvc/Controller",
	"frontEndUI/model/formatter",
	'sap/ui/core/BusyIndicator',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/m/MessageToast',
	"sap/m/Dialog",
	"sap/ui/core/Fragment",
	"frontEndUI/model/models",
  "sap/m/StandardTile",
  "sap/m/TileContainer"
],
/**
 * @param {typeof sap.ui.core.mvc.Controller} Controller
 */
function(BaseController, Controller, formatter, BusyIndicator, Filter, FilterOperator, MessageToast, Dialog, Fragment, CMSModel, StandardTile, TileContainer) {
	"use strict";
	let oRouter, oGlobalModel ;


	return BaseController.extend("frontEndUI.controller.HomeView", {
		formatter: formatter,
		onInit: function() {
			this.oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			
			BusyIndicator.show(0);
			const oRoute = oRouter.getRoute("HomeView");
			if (oRoute) {
				oRoute.attachMatched(this.onObjectMatched, this);
			}
 
		},
		onObjectMatched: function() {
			BusyIndicator.hide();
			  oGlobalModel = sap.ui.getCore().getModel("oGlobalModel");
				if(oGlobalModel.getProperty("/LoginView/username")===""|| oGlobalModel.getProperty("/LoginView/username")===undefined){
					
					oRouter.navTo("LoginView");
					return
				}

			  this.loadMenuTiles();
		},	

		onAfterRendering: function() {
			BusyIndicator.hide();
		},
		onRefreshData: function() {
			this.onObjectMatched();
		},

		onNavBack: function() {
			oRouter.navTo("RouteHomeView", true);
		},

    loadMenuTiles: function () {
			BusyIndicator.show(0);
      const oView = this.getView();
      const oContainer = oView.byId("menuTileContainer");
	  const username = oGlobalModel.getProperty("/LoginView/username");
 var that=this
       $.ajax({
         url: "/oData/v1/UserServices/getLoginUserMenu",
  method: "POST",
  contentType: "application/json",
  data: JSON.stringify({ username }),
        success: function (aData) {
          if (!Array.isArray(aData.data)) {
            MessageToast.show("Menu data format invalid");
            return;
          }

           oContainer.removeAllItems()
          aData.data.forEach(function (oItem) {
            const oTile = new StandardTile({
              title: oItem.label,
              info: oItem.menu,
              icon: "sap-icon://action", // Change icon based on oItem.menu if needed
              press: function () {
                oRouter.navTo(oItem.path); // Ensure route is configured
              }.bind(this)
            });
            oContainer.addItem(oTile);
			BusyIndicator.hide();
          }.bind(this));
		  	BusyIndicator.hide(0);
        }.bind(this),
        error: function () {
          MessageToast.show("Failed to load menu items.");
        }
      });
    },
	fnRunremainderScheduler: function () {
      const oView = this.getView(); 
	  BusyIndicator.show(0);
	  const username = oGlobalModel.getProperty("/LoginView/username");
 var that=this
       $.ajax({
         url: "/oData/v1/UserServices/remainderScheduler",
		method: "POST",
		contentType: "application/json",
		data: JSON.stringify({ username }),
        success: function (aData) {
			MessageToast.show(aData.message);
			BusyIndicator.hide();

        }.bind(this),
        error: function () {
			BusyIndicator.hide();
          MessageToast.show("Failed to load menu items.");
        }
      });
    },
 











// every push call below in any cmd
// vs code --Invoke-RestMethod -Uri "https://api.telegram.org/bot8086484955:AAFu9VJKuP7R9IijFT17BoHCBTz3rbMxdFc/setWebhook" -Method Post -Body @{url="https://pravyafamapp.onrender.com/oData/v1/TelegramService/webhook"}

// cmd -- curl -F "url=https://pravyafamapp.onrender.com/oData/v1/TelegramService/webhook" https://api.telegram.org/bot8086484955:AAFu9VJKuP7R9IijFT17BoHCBTz3rbMxdFc/setWebhook

 
sendTelegramMessage: function () {
    const that = this;

    const payload = {
        chatId: "1006472940", // Replace with actual Telegram chat ID
        message: "Hello from SAPUI5!"
    };

    BusyIndicator.show();

    $.ajax({
        url:"/oData/v1/TelegramService/sendMessage",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(payload),
        success: function (response) {
            BusyIndicator.hide();

            // Optional: show toast or save result
            sap.m.MessageToast.show("Telegram message sent!");
          console.log(response)
            const model = new sap.ui.model.json.JSONModel(response);
            that.getView().setModel(model, "telegram");
        },
        error: function (err) {
            BusyIndicator.hide();
            sap.m.MessageToast.show("Failed to send Telegram message.");
        }
    });
},




	// Bot start here
	onOpenBotPopoverforalert: function (oEvent) {
   var that = this;

  // Ensure OneSignal is ready
   if (window.OneSignalDeferred) {
    window.OneSignalDeferred.push(async function (OneSignal) {
      // Listen to notification display
      OneSignal.Notifications.addEventListener('click', function (event) {
        console.log('Notification clicked:', event);
      });

      OneSignal.Notifications.addEventListener('display', function (event) {
        console.log('Notification displayed:', event);
      });
    });
  } else {
    console.error("OneSignalDeferred not available");
  }


	},
	// Bot start here
	onOpenBotPopover: function (oEvent) {
   var that = this;

   
  var oView = this.getView();

  if (!this._pBotPopover) {
    this._pBotPopover = Fragment.load({
      id: oView.getId(),
      name: "frontEndUI.view.fragment.BotPopover", // adjust namespace
      controller: this
    }).then(function (oPopover) {
      oView.addDependent(oPopover);
      oPopover.openBy(oEvent.getSource());
      return oPopover;
    });
  } else {
    this._pBotPopover.then(function (oPopover) {
      oPopover.openBy(oEvent.getSource());
    });
  }
},

onCloseBotPopover: function () {
  this.byId("botPopover").close();
},
onStartVoiceInput: function () {
    const oButton = this.byId("voiceButton");
    const oInput = this.byId("userInput");
	oInput.setValue('')

    if (!('webkitSpeechRecognition' in window)) {
        sap.m.MessageToast.show("Speech recognition not supported.");
        return;
    }

    // Create and configure recognition
    if (!this._recognition) {
        this._recognition = new webkitSpeechRecognition();
        this._recognition.continuous = true; // ✅ Keep listening
        this._recognition.interimResults = false;
        this._recognition.lang = "en-US";

        this._recognition.onresult = function (event) {
            const transcript = event.results[event.results.length - 1][0].transcript;
            oInput.setValue(transcript);
        };

        this._recognition.onerror = function (event) {
            console.error("Speech recognition error:", event.error);
            sap.m.MessageToast.show("Error: " + event.error);
            this.stopRecognition(); // force stop
        }.bind(this);

        this._recognition.onend = function () {
            if (this._isRecording) {
                console.log("Recognition ended, restarting...");
                this._recognition.start(); // 🔁 auto-restart if still recording
            } else {
                oButton.setIcon("sap-icon://microphone");
            }
        }.bind(this);
    }

    if (!this._isRecording) {
        this._isRecording = true;
        this._recognition.start();
        oButton.setIcon("sap-icon://sound-off");
    } else {
        this.stopRecognition();
    }
},
stopRecognition: function () {
    const oButton = this.byId("voiceButton");
    this._isRecording = false;
    if (this._recognition) {
        this._recognition.stop();
    }
    oButton.setIcon("sap-icon://microphone");
},
onSendMessage: function () {
  var oInput = this.byId("userInput");
  var sText = oInput.getValue().trim();
  if (!sText) return;

  var oChatArea = this.byId("chatArea");

  // User message (right aligned)
  oChatArea.addItem(new sap.m.HBox({
    justifyContent: "End",
	width:"100%",
    items: [
      new sap.m.MessageStrip({
        text: "Me: "+sText,
        type: "Information",
        showIcon: false,
        showCloseButton: false
      }).addStyleClass("userMessage")
    ]
  }));

  oInput.setValue("");

  var oTextFromPBot = this.handleBotLogic(sText);
  // Bot response (left aligned)
  setTimeout(function () {
    oChatArea.addItem(new sap.m.HBox({
      justifyContent: "Start",
	  width:"100%",
      items: [
        new sap.m.MessageStrip({
          text: "PBOT: " + oTextFromPBot,
          type: "Success",
          showIcon: false,
          showCloseButton: false
        }).addStyleClass("botMessage")
      ]
    }));
  }, 500);
},
handleBotLogicMain:  function (sMessage) {
	var pBotMsg ="";

 
  function parseDate(str) {
    const today = new Date();
    const dayMap = {
      "today": new Date(),
      "tomorrow": new Date(today.getTime() + 86400000),
      "yesterday": new Date(today.getTime() - 86400000)
    };

    str = str.toLowerCase();
    if (dayMap[str]) {
      return dayMap[str];
    }

    // Try parsing date (basic format: dd mm yyyy or dd month yyyy)
    const parsedDate = new Date(str);
    return isNaN(parsedDate) ? null : parsedDate;
  }

  function formatDateTime(date, timeStr) {
  if (!date || !timeStr) return "";

  let [hour, meridian] = timeStr.toLowerCase().split(/am|pm/);
  let [h, m] = hour.trim().split(":");
  h = parseInt(h || 0);
  m = parseInt(m || 0);

  if (meridian === "pm" && h < 12) h += 12;
  if (meridian === "am" && h === 12) h = 0;

  date.setHours(h, m || 0);
  return date.toISOString(); // standardized UTC
}


  var result = {
    title: "",
    desc: "",
    from: "",
    to: ""
  };

  var lowerMsg = sMessage.toLowerCase();
  if (lowerMsg.startsWith("create reminder")) {
    var messageBody = sMessage.substring("create reminder".length).trim();

    let forIndex = messageBody.indexOf(" for ");
    let fromIndex = messageBody.indexOf(" from ");

    if (fromIndex !== -1) {
      result.title = messageBody.substring(0, forIndex !== -1 ? forIndex : fromIndex).trim();
      result.desc = forIndex !== -1 ? messageBody.substring(forIndex + 5, fromIndex).trim() : "";

      var datetimeStr = messageBody.substring(fromIndex + 6).trim();
      var toIndex = datetimeStr.indexOf(" to ");
      if (toIndex !== -1) {
        var fromRaw = datetimeStr.substring(0, toIndex).trim();
        var toRaw = datetimeStr.substring(toIndex + 4).trim();

        // Extract date part from "tomorrow 8am" etc.
        var fromParts = fromRaw.split(" ");
        var toParts = toRaw.split(" ");

        var fromDate = parseDate(fromParts[0]);
        var toDate = parseDate(toParts[0]);

        result.from = formatDateTime(fromDate, fromParts.slice(1).join(" "));
        result.to = formatDateTime(toDate, toParts.slice(1).join(" "));
      }
    }
  }
  

  pBotMsg= `Title: ${result.title}, Description: ${result.desc}, From: ${result.from}, To: ${result.to}`;

	return pBotMsg ;
},
onClearChat: function () {
  var oChatArea = this.byId("chatArea");
  oChatArea.removeAllItems();
},

handleBotLogic: function (sMessage) {
  function parseDate(str) {
    const today = new Date();
    const dayMap = {
      "today": new Date(),
      "tomorrow": new Date(today.getTime() + 86400000),
      "yesterday": new Date(today.getTime() - 86400000)
    };
    str = str.toLowerCase();
    if (dayMap[str]) return dayMap[str];
    const parsed = new Date(str);
    return isNaN(parsed) ? null : parsed;
  }

  function formatToISO(date, timeStr) {
    if (!date || !timeStr) return "";
    let [hour, meridian] = timeStr.toLowerCase().split(/am|pm/);
    let [h, m] = hour.trim().split(":");
    h = parseInt(h || 0);
    m = parseInt(m || 0);
    if (meridian === "pm" && h < 12) h += 12;
    if (meridian === "am" && h === 12) h = 0;
    date.setHours(h, m || 0, 0, 0);
    return date.toISOString();
  }

  let result = {
    title: "",
    description: "",
    fromDateTime: "",
    toDateTime: "",
    username: "praveen", // static for now
    type: "Type07",    // static type, you can make this dynamic if needed
    icon: "sap-icon://appointment-2" // default, override as needed
  };

  let lowerMsg = sMessage.toLowerCase();
  if (lowerMsg.startsWith("create reminder")) {
    let messageBody = sMessage.substring("create reminder".length).trim();
    let forIndex = messageBody.indexOf(" for ");
    let fromIndex = messageBody.indexOf(" from ");

    if (fromIndex !== -1) {
      result.title = messageBody.substring(0, forIndex !== -1 ? forIndex : fromIndex).trim();
      result.description = forIndex !== -1
        ? messageBody.substring(forIndex + 5, fromIndex).trim()
        : "";

      let datetimeStr = messageBody.substring(fromIndex + 6).trim();
      let toIndex = datetimeStr.indexOf(" to ");
      if (toIndex !== -1) {
        let fromRaw = datetimeStr.substring(0, toIndex).trim();   // e.g., "tomorrow 8am"
        let toRaw = datetimeStr.substring(toIndex + 4).trim();    // e.g., "tomorrow 11am"

        let fromParts = fromRaw.split(" ");
        let toParts = toRaw.split(" ");

        let fromDate = parseDate(fromParts[0]);
        let toDate = parseDate(toParts[0]);

        result.fromDateTime = formatToISO(fromDate, fromParts.slice(1).join(" "));
        result.toDateTime = formatToISO(toDate, toParts.slice(1).join(" "));
      }
    }
  }
  else if(lowerMsg.startsWith("yes")){
	this.onBotUserConfirm()
  }
  else {
	return sMessage;
  }

  if (!result.title || !result.fromDateTime || !result.toDateTime) {
    return "Sorry, I couldn't understand your reminder completely. Please use the format: 'create reminder [title] for [description] from [date time] to [date time]'";
  }

  // Store payload in a variable or component so it can be used after confirmation
  this._pendingReminderPayload = [result]; // Wrap in array like onSaveReminder()

  // Return confirmation message
  return `Got it! I created a reminder:\n\n• **Title**: ${result.title}\n• **Description**: ${result.description || "(none)"}\n• **From**: ${result.fromDateTime}\n• **To**: ${result.toDateTime}\n\nDo you want to save this reminder? (Yes/No)`;
},
onBotUserConfirm: function () {
  if (this._pendingReminderPayload) {
    this.insertEvents(this._pendingReminderPayload);
    sap.m.MessageToast.show("Reminder saved.");
    this._pendingReminderPayload = null;
  } else {
    sap.m.MessageToast.show("No pending reminder to save.");
  }
},



	insertEvents: function(payload) {
 
          
     var that=this;   
BusyIndicator.show(0);
        $.ajax({
  url: "/oData/v1/CalenderService/insertEvents",
  method: "POST",
  contentType: "application/json",
  data: JSON.stringify(payload),
  success: function(data) {
BusyIndicator.hide();
that.onCloseReminderDialog();
that.getCalenderEvents()
    sap.m.MessageToast.show("Reminder added successfully!");
    // Close dialog or reset form if needed
  },
  error: function(xhr, status, error) {
BusyIndicator.hide();
    sap.m.MessageToast.show("Error saving reminder: " + error);
  }
});
       
		},
	


		
	});
});