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
    function (Controller, formatter, _MessageToast, History, Fragment, JSONModel, Component) {
        "use strict";
        var oGlobalModel;
        return Controller.extend("PersonalAssistantUI.controller.BaseController", {
            formatter: formatter,
            onBaseInit: function () {
                oGlobalModel = sap.ui.getCore().getModel("oGlobalAIModel");
                this.getLoggedInUserDetailsAndNotifications();
            },
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


            // ****************************** Notification   ******************************
            onUserNotificationPress: function (oEvent) {
                // oEvent.getSource() gives you the ShellBar
                var oSource = oEvent.getSource();
                var oNotificationModel = new sap.ui.model.json.JSONModel({
                    notifications: [
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
                    ]
                });

                this.getView().setModel(oNotificationModel, "notif");

                //this.getView().setModel(oGlobalModel, "notif");

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
                var oItem = oEvent.getParameter("item");
                sap.m.MessageToast.show("Closed: " + oItem.getTitle());
            },

            onListItemPress: function (oEvent) {
                var oItem = oEvent.getSource();
                sap.m.MessageToast.show("Pressed: " + oItem.getTitle());
            },

            onAcceptPress: function (oEvent) {
                sap.m.MessageToast.show("Accepted!");
            },

            onRejectPress: function (oEvent) {
                sap.m.MessageToast.show("Rejected!");
            },


            // ****************************** Notification End  ******************************
            // ****************************** UserDetails  Start ******************************
            getLoggedInUserDetailsAndNotifications : function(){
        let oDashboardData = oGlobalModel.getProperty("/userDetails");
        oDashboardData.username="tppkPRVN"
        oDashboardData.name="Praveen Kumar"
        oDashboardData.lastLogin="26/10/2025 10:00AM"
        oDashboardData.selectedTheme="sap_horizon",          
        oDashboardData.assignedMenu.push({
          header: "Expense",
          subheader: "Manage your spending",
          value: 200,
          valueColor: "Good",
          indicator: "Up",
          scale: "Amount",
          state: "Loaded"
        });
        oDashboardData.assignedMenu.push({
          header: "Expense Tracker",
          subheader: "Track your financial habits",
          value: 15,
          valueColor: "Neutral",
          indicator: "None",
          scale: "Track",
          state: "Loaded"
        });
        oDashboardData.assignedMenu.push({
          header: "Medicine History",
          subheader: "View your medicine records",
          value: 8,
          valueColor: "Good",
          indicator: "Up",
          scale: "Medications",
          state: "Loaded"
        });
        oDashboardData.assignedMenu.push({
          header: "Calendar",
          subheader: "View your schedule",
          value: 3,
          valueColor: "Good",
          indicator: "Up",
          scale: "Appointments",
          state: "Loaded"
        });
 
        oGlobalModel.refresh(true);
            },
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
                oGlobalModel.setProperty("/userDetails/selectedTheme", sSelectedKey);
            },

            onSettingsPress: function () {
                MessageToast.show("Settings clicked");
            },

            onAboutPress: function () {
                MessageToast.show("About clicked");
            },

            onSignOut: function () {
                MessageToast.show("Signing out...");
                // Implement your sign-out logic
            },
            // ****************************** UserDetails  End ******************************




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
            }


        });
    }
);