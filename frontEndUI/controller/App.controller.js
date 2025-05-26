sap.ui.define([
	"sap/ui/core/mvc/Controller"
	],
	function (Controller) {
	"use strict";

	return Controller.extend("frontEndUI.controller.App", {
		onInit: function () {

		},

		fnNav:function(){

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("RouteHomeView", true);

		}
	});
});
