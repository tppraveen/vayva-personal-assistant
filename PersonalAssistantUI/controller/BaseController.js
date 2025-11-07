sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "PersonalAssistantUI/model/formatter",
        'sap/m/MessageToast',
        "sap/ui/core/routing/History",
        "sap/ui/core/Fragment",
        "sap/ui/model/json/JSONModel",
        "sap/ui/core/Component"
    ],
    function (Controller, formatter, MessageToast, History, Fragment, JSONModel, Component) {
        "use strict";
         return Controller.extend("PersonalAssistantUI.controller.BaseController", {
            formatter: formatter,
            
            // Success, Warning,Error message used in Line and Product Standard
            onShowSuccess: function (message) {
                sap.m.MessageBox.success(
                    message, {
                    title: this.oResourceBundle.getText("SUCCESS"),
                    actions: [sap.m.MessageBox.Action.OK],
                    onClose: function () { }
                }
                );
            },
            onShowWarning: function (message) {
                sap.m.MessageBox.warning(
                    message, {
                    title: this.oResourceBundle.getText("WARNING"),
                    actions: [sap.m.MessageBox.Action.OK],
                    onClose: function () { }
                }
                );
            },
            onShowError: function (message) {
                sap.m.MessageBox.error(
                    message, {
                    title: this.oResourceBundle.getText("ERROR"),
                    actions: [sap.m.MessageBox.Action.OK],
                    onClose: function () { }
                }
                );
            },
            onShowMessageTost: function (message) {
                sap.m.MessageToast.show(message);
            },


            // **************** Home Page -------- Nav Bar & Side Navigation  Start-------------- ***************
            
            onHomeIconPress:function(){                
				const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("Home");
            },
             onSideNavButtonPress: function () {
                var oToolPage = this.getView().byId("toolPage");
                 var bSideExpanded = oToolPage.getSideExpanded();
                 oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
            }, 

              onCopilotPress: function (oEvent) {
                var oView = this.getView();
                var oChatModel = new JSONModel({
                    messages: [
                        { sender: "AI", text: "Hi! How can I help you with file creation?" }
                    ]
                });
                this.getView().setModel(oChatModel);

                if (!this._pPopover) {
                    this._pPopover = Fragment.load({
                        id: oView.getId(),
                        name: "PersonalAssistantUI.view.fragment.Global.Chat",
                        controller: this
                    }).then(function (oPopover) {
                        oView.addDependent(oPopover);
                        return oPopover;
                    });
                }

                this._pPopover.then(function (oPopover) {
                    oPopover.openBy(oEvent.getSource());
                });
            },

            onSendMessage: function () {
                var oView = this.getView();
                var oModel = oView.getModel();
                var aMessages = oModel.getProperty("/messages");
                var sText = oView.byId("chatInput").getValue();

                if (!sText) {
                    MessageToast.show("Please enter a message");
                    return;
                }

                // Add user message
                aMessages.push({ sender: "You", text: sText });
                oModel.setProperty("/messages", aMessages);
                oView.byId("chatInput").setValue("");

                // Simulate AI reply (replace with real backend call)
                setTimeout(() => {
                    aMessages.push({
                        sender: "AI",
                        text: "I'm generating your document now..."
                    });
                    oModel.setProperty("/messages", aMessages);
                }, 1000);
            },

             
            // ****************************** Notification   ******************************
            onUserNotificationPress: function (oEvent) {
                // oEvent.getSource() gives you the ShellBar
                var oSource = oEvent.getSource(); 
                // Open your popover fragment for notifications
                if (!this._oNotifPopover) {
                    Fragment.load({
                        name: "PersonalAssistantUI.view.fragment.Global.UserNotificationPopover",
                        controller: this
                    }).then(function (oPopover) {
                        this._oNotifPopover = oPopover;
                        this.getView().addDependent(this._oNotifPopover);
                        this._oNotifPopover.openBy(oSource); // Open by ShellBar notification icon
                    }.bind(this));
                } else {
                    this._oNotifPopover.openBy(oSource);
                }
            },
            onItemClose: function (oEvent) {
                var oItem = oEvent.getSource(),
                    oList = oItem.getParent();

                oList.removeItem(oItem);
                MessageToast.show("Item Closed: " + oItem.getTitle());
		    },
 


            // ****************************** Notification End  ******************************
            // ****************************** UserDetails  Start ******************************
          
            onUserAvatarPress: function (oEvent) {
                var oView = this.getView();
                // Load fragment lazily
                if (!this._oUserPopover) {
                    Fragment.load({
                        id: oView.getId(),
                        name: "PersonalAssistantUI.view.fragment.Global.UserPopover",
                        controller: this
                    }).then(function (oPopover) {
                        this._oUserPopover = oPopover;
                        oView.addDependent(this._oUserPopover);
                        this._oUserPopover.openBy(oEvent.getSource());
                    }.bind(this));
                } else {
                    this._oUserPopover.openBy(oEvent.getSource());
                }
            },

            onThemeChange: function (oEvent) {
                var oComboBox = oEvent.getSource();
                var sSelectedKey = oComboBox.getSelectedKey();
                sap.ui.getCore().applyTheme(sSelectedKey);
                this.getView().getModel("oUserDetailsPopoverModel").setProperty("/userDetails/selectedTheme", sSelectedKey);
                // Update global model
                sap.ui.getCore().getModel("oGlobalAIModel").setProperty("/userDetails/selectedTheme", sSelectedKey);
            },

            onSettingsPress: function () {
                MessageToast.show("Settings clicked");
            },
            onContactSupport: function () {
                MessageToast.show("Contact Support clicked");
            },  
 
            onAboutPress: function () {
                MessageToast.show("About clicked");
            },

            onSignOut: function () {
                MessageToast.show("Signing out...");
            },
            // ****************************** UserDetails  End ******************************
            
            // **************** Home Page -------- Nav Bar & Side Navigation  End -------------- ***************

           



          


        });
    }
);