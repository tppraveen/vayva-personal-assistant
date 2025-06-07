sap.ui.define([], () => {
	"use strict";

	return {
    /**
     * Returns a CSS class name based on the type.
     * @param {string} type - The transaction type (e.g., "Expense", "Income").
     * @returns {string} CSS class to apply to the row
     */
		  formatDateTime: function(isoDateStr) {
			console.log(isoDateStr)
      if (!isoDateStr) return "";
      const date = new Date(isoDateStr);
      const pad = (n) => n.toString().padStart(2, '0');
      const dd = pad(date.getDate());
      const mm = pad(date.getMonth() + 1);
      const yyyy = date.getFullYear();
      const hh = pad(date.getHours());
      const min = pad(date.getMinutes());
      return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
    },
     rowColorByType: function (type) {
     // States: None, Success, Warning, Error, Information
      if (!type) return "";
      switch (type) {
        case "expense":
          return "Error";
        case "Income":
          return "Success";
        case "income":
          return "Success";
        default:
          return "Warning";
      }
    },
		getLength: function (aItems) {
			return aItems?.length || 0;
		},
		fnReworkIcon: function (s) {

		},
		 
		 

	};
});