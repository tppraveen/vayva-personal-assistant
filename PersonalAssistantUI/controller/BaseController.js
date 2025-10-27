sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "PersonalAssistantUI/model/formatter",
        'sap/m/MessageToast',
        "sap/ui/core/routing/History",
        "sap/ui/core/Fragment"
    ],
    function (Controller, formatter, _MessageToast, History, Fragment) {
        "use strict";

        return Controller.extend("PersonalAssistantUI.controller.BaseController", {
            formatter: formatter,
            onInit: function () {

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
                sap.m.MessageToast.show( message);
            },
            

        });
    }
);