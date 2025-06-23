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
 


	// Bot start here
	onOpenBotPopover: function (oEvent) {
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


return
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

  // Bot response (left aligned)
  setTimeout(function () {
    oChatArea.addItem(new sap.m.HBox({
      justifyContent: "Start",
	  width:"100%",
      items: [
        new sap.m.MessageStrip({
          text: "PBOT: " + sText,
          type: "Success",
          showIcon: false,
          showCloseButton: false
        }).addStyleClass("botMessage")
      ]
    }));
  }, 500);
}

		
	});
});