sap.ui.define([], () => {
	"use strict";

	return {
     
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
     
	 
		 

	};
});