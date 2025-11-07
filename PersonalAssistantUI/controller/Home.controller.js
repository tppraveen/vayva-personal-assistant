sap.ui.define([
  "PersonalAssistantUI/controller/BaseController",
  "PersonalAssistantUI/model/formatter",
  "sap/ui/Device"
], function (BaseController, formatter, Device) {
  "use strict";
  return BaseController.extend("PersonalAssistantUI.controller.Home", {
    formatter: formatter,
    onInit: function () {
      this._setToggleButtonTooltip(!Device.system.desktop);
    },

  });
});