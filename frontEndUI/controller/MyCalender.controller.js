
sap.ui.define([
	"frontEndUI/controller/BaseController",
	"sap/ui/core/mvc/Controller",
	"frontEndUI/model/formatter",  "sap/ui/core/UIComponent",
	"sap/ui/core/BusyIndicator",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/m/Dialog",
	"sap/ui/core/Fragment",
	"frontEndUI/model/models",
	"sap/m/StandardTile",
	"sap/m/TileContainer",
	"sap/ui/export/Spreadsheet",
	"sap/ui/model/json/JSONModel",
	"sap/ui/unified/library",
	"sap/ui/core/library",
	"sap/ui/core/format/DateFormat",
	"sap/m/library",
	"sap/ui/core/date/UI5Date",
	"sap/m/CustomListItem"
], function (
	BaseController,Controller,formatter,UIComponent,BusyIndicator,Filter,FilterOperator,MessageToast,MessageBox,Dialog,Fragment,CMSModel,StandardTile,TileContainer,Spreadsheet,JSONModel,unifiedLibrary,coreLibrary,DateFormat,mobileLibrary,UI5Date,CustomListItem
) {
	"use strict";
    let oRouter, oGlobalModel;


	var CalendarDayType = unifiedLibrary.CalendarDayType;
	var ValueState = coreLibrary.ValueState;
	var StickyMode = mobileLibrary.PlanningCalendarStickyMode;
    return BaseController.extend("frontEndUI.controller.MyCalender", {
      formatter: formatter,
      onInit: function () {
        this.oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
        oRouter = sap.ui.core.UIComponent.getRouterFor(this);

        BusyIndicator.show(0);
        const oRoute = oRouter.getRoute("MyCalender");
        if (oRoute) {
          oRoute.attachMatched(this.onObjectMatched, this);
        }

      },
      onObjectMatched: function () {
        BusyIndicator.hide();
        oGlobalModel = sap.ui.getCore().getModel("oGlobalModel");
        if (oGlobalModel.getProperty("/LoginView/username") === "" || oGlobalModel.getProperty("/LoginView/username") === undefined) {
          oRouter.navTo("LoginView");
          return
        } 
		
		var oModel = new JSONModel();
		this.getView().setModel(oModel)
oModel = new JSONModel();
			oModel.setData({allDay: false});
			this.getView().setModel(oModel, "allDay");

			oModel = new JSONModel();
			oModel.setData({ stickyMode: StickyMode.None, enableAppointmentsDragAndDrop: true, enableAppointmentsResize: true, enableAppointmentsCreate: true });
			this.getView().setModel(oModel, "settings");

			this.getView().setModel(new sap.ui.model.json.JSONModel({
    viewMode: "calendar" // default
}), "viewModel");

        this.getCalenderEvents()
		this.getCalenderTypes();
		this.getCalenderRef();

		let oTodayDateTime = UI5Date.getInstance(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
		this.getView().getModel().setProperty("/startDate",oTodayDateTime);

		
		this.loadCreateReminderDetails();
      },
	  
      onNavBack: function () {
        oRouter.navTo("HomeView", true);
      },
	  getCalenderTypes:function(){
			var aTypes = [
  {
    "type": "Type01",
    "category": "Work/Study",
    "icon": "sap-icon://study-leave",
    "exampleTitle": "Online Course: JavaScript",
    "description": "Study sessions, work blocks",
    "color": "#1E90FF",
    "colorClass": "colorBlue"
  },
  {
    "type": "Type02",
    "category": "Exercise",
    "icon": "sap-icon://activity-items",
    "exampleTitle": "Morning Run",
    "description": "Any physical activity or gym",
    "color": "#32CD32",
    "colorClass": "colorGreen"
  },
  {
    "type": "Type03",
    "category": "Meal",
    "icon": "sap-icon://meal",
    "exampleTitle": "Lunch with Anna",
    "description": "Meals, social dining",
    "color": "#FFA500",
    "colorClass": "colorOrange"
  },
  {
    "type": "Type04",
    "category": "Reminder",
    "icon": "sap-icon://bell",
    "exampleTitle": "Pay Credit Card Bill",
    "description": "To-do, tasks, payments",
    "color": "#FF4500",
    "colorClass": "colorRed"
  },
  {
    "type": "Type05",
    "category": "Personal Project",
    "icon": "sap-icon://create-form",
    "exampleTitle": "Write Blog Post",
    "description": "Side projects, hobbies",
    "color": "#8A2BE2",
    "colorClass": "colorPurple"
  },
  {
    "type": "Type06",
    "category": "Event",
    "icon": "sap-icon://calendar",
    "exampleTitle": "Friend’s Birthday",
    "description": "Birthdays, events, celebrations",
    "color": "#FF69B4",
    "colorClass": "colorPink"
  },
  {
    "type": "Type07",
    "category": "Travel",
    "icon": "sap-icon://flight",
    "exampleTitle": "Trip to Mountains",
    "description": "Personal trips",
    "color": "#00CED1",
    "colorClass": "colorCyan"
  },
  {
    "type": "Type08",
    "category": "Family",
    "icon": "sap-icon://family-care",
    "exampleTitle": "Call Parents",
    "description": "Family time or events",
    "color": "#FFD700",
    "colorClass": "colorGold"
  },
  {
    "type": "Type09",
    "category": "Reading",
    "icon": "sap-icon://open-book",
    "exampleTitle": "Read: Atomic Habits",
    "description": "Dedicated reading time",
    "color": "#7FFF00",
    "colorClass": "colorLightGreen"
  },
  {
    "type": "Type10",
    "category": "Meditation",
    "icon": "sap-icon://umbrella",
    "exampleTitle": "Evening Meditation",
    "description": "Self-care, reflection",
    "color": "#40E0D0",
    "colorClass": "colorTeal"
  },
  {
    "type": "Type11",
    "category": "Health",
    "icon": "sap-icon://stethoscope",
    "exampleTitle": "Doctor Appointment",
    "description": "Health checkups, medication",
    "color": "#DC143C",
    "colorClass": "colorCrimson"
  },
  {
    "type": "Type12",
    "category": "Finance",
    "icon": "sap-icon://money-bills",
    "exampleTitle": "Budget Review",
    "description": "Bills, budgeting",
    "color": "#228B22",
    "colorClass": "colorDarkGreen"
  },
  {
    "type": "Type13",
    "category": "Cleaning",
    "icon": "sap-icon://washing-machine",
    "exampleTitle": "Clean Kitchen",
    "description": "Chores, housework",
    "color": "#D2691E",
    "colorClass": "colorChocolate"
  },
  {
    "type": "Type14",
    "category": "Groceries",
    "icon": "sap-icon://cart",
    "exampleTitle": "Weekly Grocery Run",
    "description": "Shopping, errands",
    "color": "#FF8C00",
    "colorClass": "colorDarkOrange"
  },
  {
    "type": "Type15",
    "category": "Entertainment",
    "icon": "sap-icon://video",
    "exampleTitle": "Watch Movie",
    "description": "Leisure, TV, social fun",
    "color": "#BA55D3",
    "colorClass": "colorOrchid"
  },
  {
    "type": "Type16",
    "category": "Sleep/Rest",
    "icon": "sap-icon://bed",
    "exampleTitle": "Nap Time",
    "description": "Rest time, night sleep",
    "color": "#1E90FF",
    "colorClass": "colorBlue"
  },
  {
    "type": "Type17",
    "category": "Goals",
    "icon": "sap-icon://goal",
    "exampleTitle": "Track Monthly Goals",
    "description": "Goal check-ins",
    "color": "#32CD32",
    "colorClass": "colorGreen"
  },
  {
    "type": "Type18",
    "category": "Journaling",
    "icon": "sap-icon://notes",
    "exampleTitle": "Write in Journal",
    "description": "Journaling, diary time",
    "color": "#FF69B4",
    "colorClass": "colorPink"
  },
  {
    "type": "Type19",
    "category": "Gardening",
    "icon": "sap-icon://tree",
    "exampleTitle": "Water the plants",
    "description": "Nature, hobbies",
    "color": "#228B22",
    "colorClass": "colorDarkGreen"
  },
  {
    "type": "Type20",
    "category": "Volunteer / Social",
    "icon": "sap-icon://employee",
    "exampleTitle": "Help at Shelter",
    "description": "Giving back, social events",
    "color": "#FF6347",
    "colorClass": "colorTomato"
  }
]



;
			// for (var key in CalendarDayType) {
			// 	aTypes.push({
			// 		type: CalendarDayType[key]
			// 	});
			// }
			this.getView().getModel().setProperty("/types",aTypes)
	  },
	  getCalenderRef:function(){
			var aCalenderTypeRef = [
			{
						text: "Team Meeting",
						type: CalendarDayType.Type01
					},
					{
						text: "Personal",
						type: CalendarDayType.Type05
					},
					{
						text: "Discussions",
						type: CalendarDayType.Type08
					},
					{
						text: "Out of office",
						type: CalendarDayType.Type09
					},
					{
						text: "Private meeting",
						type: CalendarDayType.Type03
					},
					{
						text: "Private meeting",
						type: CalendarDayType.Type02
					},
					{
						text: "Private meeting",
						type: CalendarDayType.Type04
					}
				]
			this.getView().getModel().setProperty("/supportedAppointmentItems",aCalenderTypeRef)
	  },
        	getCalenderEvents: function() {
 
          
        const that = this;
         const username = oGlobalModel.getProperty("/LoginView/username");
       
         const payload = {
          username: username
        };
BusyIndicator.show(0);
        $.ajax({
          url: "/oData/v1/CalenderService/getAllEvents",
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify(payload),
          success: function (response) {
            BusyIndicator.hide();
            if (response.status === "success") {

				//for table
 const data = response.data.map(item => ({
          ...item,
          _isEditable: false
        }));
        const model = new sap.ui.model.json.JSONModel(data);
        that.getView().setModel(model, "reminders");
				// for table end
               
			   const rawAppointments = response.data;

        const transformedAppointments = rawAppointments.map(item => {
            const start = new Date(item.startDate);
            const end = new Date(item.endDate);

            return {
                title: item.title,
                text: item.text,
                type: sap.ui.unified.CalendarDayType[item.type] || sap.ui.unified.CalendarDayType.Type01,
                icon: item.icon || undefined,
                tentative: true, // Set based on your logic
                startDate: UI5Date.getInstance(
                    start.getFullYear(),
                    start.getMonth(),         // Months are 0-indexed in JS
                    start.getDate(),
                    start.getHours(),
                    start.getMinutes()
                ),
                endDate: UI5Date.getInstance(
                    end.getFullYear(),
                    end.getMonth(),
                    end.getDate(),
                    end.getHours(),
                    end.getMinutes()
                )
            };
        });

        that.getView().getModel().setProperty("/appointments", transformedAppointments);
        console.log(transformedAppointments);

		 
            } else {
              MessageToast.show("Failed to load upcoming Reminder data.");
            }
          },
          error: function (xhr, status, error) {
            BusyIndicator.hide();
            MessageToast.show("Error load upcoming Reminder data.");
            console.error("Filter API error:", error);
          }
        });
       
		},
 

		handleAppointmentDrop: function (oEvent) {
			var oAppointment = oEvent.getParameter("appointment"),
				oStartDate = oEvent.getParameter("startDate"),
				oEndDate = oEvent.getParameter("endDate"),
				bCopy = oEvent.getParameter("copy"),
				sAppointmentTitle = oAppointment.getTitle(),
				oModel = this.getView().getModel(),
				oNewAppointment;

			if (bCopy) {
				oNewAppointment = {
					title: sAppointmentTitle,
					icon: oAppointment.getIcon(),
					text: oAppointment.getText(),
					type: oAppointment.getType(),
					startDate: oStartDate,
					endDate: oEndDate
				};
				oModel.getData().appointments.push(oNewAppointment);
				oModel.updateBindings();
			} else {
				oAppointment.setStartDate(oStartDate);
				oAppointment.setEndDate(oEndDate);
			}

			MessageToast.show("Appointment with title \n'"
				+ sAppointmentTitle
				+ "'\n has been " + (bCopy ? "create" : "moved")
			);
		},

		handleAppointmentResize: function (oEvent) {
			var oAppointment = oEvent.getParameter("appointment"),
				oStartDate = oEvent.getParameter("startDate"),
				oEndDate = oEvent.getParameter("endDate"),
				sAppointmentTitle = oAppointment.getTitle();

			oAppointment.setStartDate(oStartDate);
			oAppointment.setEndDate(oEndDate);

			MessageToast.show("Appointment with title \n'"
				+ sAppointmentTitle
				+ "'\n has been resized"
			);
		},

		handleAppointmentCreateDnD: function(oEvent) {
			var oStartDate = oEvent.getParameter("startDate"),
				oEndDate = oEvent.getParameter("endDate"),
				sAppointmentTitle = "New Appointment",
				oModel = this.getView().getModel(),
				oNewAppointment = {
					title: sAppointmentTitle,
					startDate: oStartDate,
					endDate: oEndDate
				};

			oModel.getData().appointments.push(oNewAppointment);
			oModel.updateBindings();

			MessageToast.show("Appointment with title \n'"
				+ sAppointmentTitle
				+ "'\n has been created"
			);
		},

		handleViewChange: function () {
			MessageToast.show("'viewChange' event fired.");
		},

		handleAppointmentSelect: function (oEvent) {
			var oAppointment = oEvent.getParameter("appointment"),
				oStartDate,
				oEndDate,
				oTrimmedStartDate,
				oTrimmedEndDate,
				bAllDate,
				oModel,
				oView = this.getView();

			if (oAppointment === undefined) {
				return;
			}

			oStartDate = oAppointment.getStartDate();
			oEndDate = oAppointment.getEndDate();
			oTrimmedStartDate = UI5Date.getInstance(oStartDate);
			oTrimmedEndDate = UI5Date.getInstance(oEndDate);
			bAllDate = false;
			oModel = this.getView().getModel("allDay");

			if (!oAppointment.getSelected() && this._pDetailsPopover) {
				this._pDetailsPopover.then(function(oResponsivePopover){
					oResponsivePopover.close();
				});
				return;
			}

			this._setHoursToZero(oTrimmedStartDate);
			this._setHoursToZero(oTrimmedEndDate);

			if (oStartDate.getTime() === oTrimmedStartDate.getTime() && oEndDate.getTime() === oTrimmedEndDate.getTime()) {
				bAllDate = true;
			}

			oModel.getData().allDay = bAllDate;
			oModel.updateBindings();

			if (!this._pDetailsPopover) {
				this._pDetailsPopover = Fragment.load({
					id: oView.getId(),
					name: "frontEndUI.view.fragment.MyCalender.Details",
					controller: this
				}).then(function(oResponsivePopover){
					oView.addDependent(oResponsivePopover);
					return oResponsivePopover;
				});
			}
			this._pDetailsPopover.then(function (oResponsivePopover) {
				oResponsivePopover.setBindingContext(oAppointment.getBindingContext());
				oResponsivePopover.openBy(oAppointment);
			});
		},

		handleMoreLinkPress: function(oEvent) {
			var oDate = oEvent.getParameter("date"),
				oSinglePlanningCalendar = this.getView().byId("SPC1");

			oSinglePlanningCalendar.setSelectedView(oSinglePlanningCalendar.getViews()[2]); // DayView

			this.getView().getModel().setData({ startDate: oDate }, true);
		},

		handleEditButton: function () {
			// The sap.m.Popover has to be closed before the sap.m.Dialog gets opened
			var oDetailsPopover = this.byId("detailsPopover");
			oDetailsPopover.close();
			this.sPath = oDetailsPopover.getBindingContext().getPath();
			this._arrangeDialogFragment("Edit appointment");
		},

		handlePopoverDeleteButton: function () {
			var oModel = this.getView().getModel(),
				oAppointments = oModel.getData().appointments,
				oDetailsPopover = this.byId("detailsPopover"),
				oAppointment = oDetailsPopover._getBindingContext().getObject();

			oDetailsPopover.close();

			oAppointments.splice(oAppointments.indexOf(oAppointment), 1);
			oModel.updateBindings();
		},

		_arrangeDialogFragment: function (sTitle) {
			var oView = this.getView();

			if (!this._pNewAppointmentDialog) {
				this._pNewAppointmentDialog = Fragment.load({
					id: oView.getId(),
					name: "frontEndUI.view.fragment.MyCalender.Modify",
					controller: this
				}).then(function(oNewAppointmentDialog){
					oView.addDependent(oNewAppointmentDialog);
					return oNewAppointmentDialog;
				});
			}

			this._pNewAppointmentDialog.then(function(oNewAppointmentDialog) {
				this._arrangeDialog(sTitle, oNewAppointmentDialog);
			}.bind(this));
		},

		_arrangeDialog: function (sTitle, oNewAppointmentDialog) {
			this._setValuesToDialogContent(oNewAppointmentDialog);
			oNewAppointmentDialog.setTitle(sTitle);
			oNewAppointmentDialog.open();
		},

		_setValuesToDialogContent: function (oNewAppointmentDialog) {
			var oAllDayAppointment = this.byId("allDay"),
				sStartDatePickerID = oAllDayAppointment.getSelected() ? "DPStartDate" : "DTPStartDate",
				sEndDatePickerID = oAllDayAppointment.getSelected() ? "DPEndDate" : "DTPEndDate",
				oTitleControl = this.byId("appTitle"),
				oTextControl = this.byId("moreInfo"),
				oTypeControl = this.byId("calenderType"),
				oStartDateControl = this.byId(sStartDatePickerID),
				oEndDateControl = this.byId(sEndDatePickerID),
				oEmptyError = {errorState:false, errorMessage: ""},
				oContext,
				oContextObject,
				oSPCStartDate,
				sTitle,
				sText,
				oStartDate,
				oEndDate,
				sType;


			if (this.sPath) {
				oContext = this.byId("detailsPopover").getBindingContext();
				oContextObject = oContext.getObject();
				sTitle = oContextObject.title;
				sText = oContextObject.text;
				oStartDate = oContextObject.startDate;
				oEndDate = oContextObject.endDate;
				sType = oContextObject.type;
			} else {
				sTitle = "";
				sText = "";
				if (this._oChosenDayData) {
					oStartDate = this._oChosenDayData.start;
					oEndDate = this._oChosenDayData.end;

					delete this._oChosenDayData;
				} else {
					oSPCStartDate = this.getView().byId("SPC1").getStartDate();
					oStartDate = UI5Date.getInstance(oSPCStartDate);
					oStartDate.setHours(this._getDefaultAppointmentStartHour());
					oEndDate = UI5Date.getInstance(oSPCStartDate);
					oEndDate.setHours(this._getDefaultAppointmentEndHour());
				}
				oAllDayAppointment.setSelected(false);
				sType = "Type01";
			}

			oTitleControl.setValue(sTitle);
			oTextControl.setValue(sText);
			oStartDateControl.setDateValue(oStartDate);
			oEndDateControl.setDateValue(oEndDate);
			oTypeControl.setValue(sType);
			this._setDateValueState(oStartDateControl, oEmptyError);
			this._setDateValueState(oEndDateControl, oEmptyError);
			this.updateButtonEnabledState(oStartDateControl, oEndDateControl, oNewAppointmentDialog.getBeginButton());
		},

		handleDialogOkButton: function () {
			var bAllDayAppointment = (this.byId("allDay")).getSelected(),
				sStartDate = bAllDayAppointment ? "DPStartDate" : "DTPStartDate",
				sEndDate = bAllDayAppointment ? "DPEndDate" : "DTPEndDate",
				sTitle = this.byId("appTitle").getValue(),
				sText = this.byId("moreInfo").getValue(),
				sType = this.byId("calenderType").getValue(),
				oStartDate = this.byId(sStartDate).getDateValue(),
				oEndDate = this.byId(sEndDate).getDateValue(),
				oModel = this.getView().getModel(),
				sAppointmentPath;

			if (this.byId(sStartDate).getValueState() !== ValueState.Error
				&& this.byId(sEndDate).getValueState() !== ValueState.Error) {

				if (this.sPath) {
					sAppointmentPath = this.sPath;
					oModel.setProperty(sAppointmentPath + "/title", sTitle);
					oModel.setProperty(sAppointmentPath + "/text", sText);
					oModel.setProperty(sAppointmentPath + "/type", sType);
					oModel.setProperty(sAppointmentPath + "/startDate", oStartDate);
					oModel.setProperty(sAppointmentPath + "/endDate", oEndDate);
				} else {
					oModel.getData().appointments.push({
						title: sTitle,
						text: sText,
						type: sType,
						startDate: oStartDate,
						endDate: oEndDate
					});
				}

				oModel.updateBindings();

				this.byId("modifyDialog").close();
			}
		},

		formatDate: function (oDate) {
			if (oDate) {
				var iHours = oDate.getHours(),
					iMinutes = oDate.getMinutes(),
					iSeconds = oDate.getSeconds();

				if (iHours !== 0 || iMinutes !== 0 || iSeconds !== 0) {
					return DateFormat.getDateTimeInstance({ style: "medium" }).format(oDate);
				} else  {
					return DateFormat.getDateInstance({ style: "medium" }).format(oDate);
				}
			}
		},

		handleDialogCancelButton:  function () {
			this.sPath = null;
			this.byId("modifyDialog").close();
		},

		handleCheckBoxSelect: function (oEvent) {
			var bSelected = oEvent.getSource().getSelected(),
				sStartDatePickerID = bSelected ? "DTPStartDate" : "DPStartDate",
				sEndDatePickerID = bSelected ? "DTPEndDate" : "DPEndDate",
				oOldStartDate = this.byId(sStartDatePickerID).getDateValue(),
				oNewStartDate = UI5Date.getInstance(oOldStartDate),
				oOldEndDate = this.byId(sEndDatePickerID).getDateValue(),
				oNewEndDate = UI5Date.getInstance(oOldEndDate);

			if (!bSelected) {
				oNewStartDate.setHours(this._getDefaultAppointmentStartHour());
				oNewEndDate.setHours(this._getDefaultAppointmentEndHour());
			} else {
				this._setHoursToZero(oNewStartDate);
				this._setHoursToZero(oNewEndDate);
			}

			sStartDatePickerID = !bSelected ? "DTPStartDate" : "DPStartDate";
			sEndDatePickerID = !bSelected ? "DTPEndDate" : "DPEndDate";
			this.byId(sStartDatePickerID).setDateValue(oNewStartDate);
			this.byId(sEndDatePickerID).setDateValue(oNewEndDate);
		},

		_getDefaultAppointmentStartHour: function() {
			return 9;
		},

		_getDefaultAppointmentEndHour: function() {
			return 10;
		},

		_setHoursToZero: function (oDate) {
			oDate.setHours(0, 0, 0, 0);
		},

		handleAppointmentCreate: function () {
			this._createInitialDialogValues(this.getView().byId("SPC1").getStartDate());
		},

		handleHeaderDateSelect: function (oEvent) {
			this._createInitialDialogValues(oEvent.getParameter("date"));
		},

		_createInitialDialogValues: function (oDate) {
			var oStartDate = UI5Date.getInstance(oDate),
				oEndDate = UI5Date.getInstance(oStartDate);

			oStartDate.setHours(this._getDefaultAppointmentStartHour());
			oEndDate.setHours(this._getDefaultAppointmentEndHour());
			this._oChosenDayData = {start: oStartDate, end: oEndDate };
			this.sPath = null;

			this._arrangeDialogFragment("Create appointment");
		},

		handleStartDateChange: function (oEvent) {
			var oStartDate = oEvent.getParameter("date");
			MessageToast.show("'startDateChange' event fired.\n\nNew start date is "  + oStartDate.toString());
		},

		updateButtonEnabledState: function (oDateTimePickerStart, oDateTimePickerEnd, oButton) {
			var bEnabled = oDateTimePickerStart.getValueState() !== ValueState.Error
				&& oDateTimePickerStart.getValue() !== ""
				&& oDateTimePickerEnd.getValue() !== ""
				&& oDateTimePickerEnd.getValueState() !== ValueState.Error;

			oButton.setEnabled(bEnabled);
		},

		handleDateTimePickerChange: function(oEvent) {
			var oDateTimePickerStart = this.byId("DTPStartDate"),
				oDateTimePickerEnd = this.byId("DTPEndDate"),
				oStartDate = oDateTimePickerStart.getDateValue(),
				oEndDate = oDateTimePickerEnd.getDateValue(),
				oErrorState = {errorState: false, errorMessage: ""};

			if (!oStartDate){
				oErrorState.errorState = true;
				oErrorState.errorMessage = "Please pick a date";
				this._setDateValueState(oDateTimePickerStart, oErrorState);
			} else if (!oEndDate){
				oErrorState.errorState = true;
				oErrorState.errorMessage = "Please pick a date";
				this._setDateValueState(oDateTimePickerEnd, oErrorState);
			} else if (!oEvent.getParameter("valid")){
				oErrorState.errorState = true;
				oErrorState.errorMessage = "Invalid date";
				if (oEvent.getSource() === oDateTimePickerStart){
					this._setDateValueState(oDateTimePickerStart, oErrorState);
				} else {
					this._setDateValueState(oDateTimePickerEnd, oErrorState);
				}
			} else if (oStartDate && oEndDate && (oEndDate.getTime() <= oStartDate.getTime())){
				oErrorState.errorState = true;
				oErrorState.errorMessage = "Start date should be before End date";
				this._setDateValueState(oDateTimePickerStart, oErrorState);
				this._setDateValueState(oDateTimePickerEnd, oErrorState);
			} else {
				this._setDateValueState(oDateTimePickerStart, oErrorState);
				this._setDateValueState(oDateTimePickerEnd, oErrorState);
			}

			this.updateButtonEnabledState(oDateTimePickerStart, oDateTimePickerEnd, this.byId("modifyDialog").getBeginButton());
		},

		handleDatePickerChange: function () {
			var oDatePickerStart = this.byId("DPStartDate"),
				oDatePickerEnd = this.byId("DPEndDate"),
				oStartDate = oDatePickerStart.getDateValue(),
				oEndDate = oDatePickerEnd.getDateValue(),
				bEndDateBiggerThanStartDate = oEndDate.getTime() < oStartDate.getTime(),
				oErrorState = {errorState: false, errorMessage: ""};

			if (oStartDate && oEndDate && bEndDateBiggerThanStartDate){
				oErrorState.errorState = true;
				oErrorState.errorMessage = "Start date should be before End date";
			}
			this._setDateValueState(oDatePickerStart, oErrorState);
			this._setDateValueState(oDatePickerEnd, oErrorState);
			this.updateButtonEnabledState(oDatePickerStart, oDatePickerEnd, this.byId("modifyDialog").getBeginButton());
		},

		_setDateValueState: function(oPicker, oErrorState) {
			if (oErrorState.errorState) {
				oPicker.setValueState(ValueState.Error);
				oPicker.setValueStateText(oErrorState.errorMessage);
			} else {
				oPicker.setValueState(ValueState.None);
			}
		},

		handleOpenLegend: function (oEvent) {
			var oSource = oEvent.getSource(),
				oView = this.getView();

			if (!this._pLegendPopover) {
				this._pLegendPopover = Fragment.load({
					id: oView.getId(),
					name: "frontEndUI.view.fragment.MyCalender.Legend",
					controller: this
				}).then(function(oLegendPopover) {
					oView.addDependent(oLegendPopover);
					return oLegendPopover;
				});
			}

			this._pLegendPopover.then(function(oLegendPopover) {
				if (oLegendPopover.isOpen()){
					oLegendPopover.close();
				} else {
					oLegendPopover.openBy(oSource);
				}
			});
		},
		
	toggleFullDay: function () {
			var oSPC = this.getView().byId("SPC1");
			oSPC.setFullDay(!oSPC.getFullDay());
		},

		zoomIn: function() {
			var oSPC = this.getView().byId("SPC1");
			var iCurrentScaleFoucs = oSPC.getScaleFactor();
			oSPC.setScaleFactor(++iCurrentScaleFoucs);
		},

		zoomOut: function() {
			var oSPC = this.getView().byId("SPC1");
			var iCurrentScaleFoucs = oSPC.getScaleFactor();
			oSPC.setScaleFactor(--iCurrentScaleFoucs);
		}




,onValueHelpRequest: function () {
  var oView = this.getView();

  // lazy load the dialog if not created yet
  if (!this._oValueHelpDialog) {
    this._oValueHelpDialog = sap.ui.xmlfragment(
      oView.getId(),
      "frontEndUI.view.fragment.MyCalender.ValueHelpDialog",
      this
    );
    oView.addDependent(this._oValueHelpDialog);
  }

  this._oValueHelpDialog.open();
},
onValueHelpSelect: function(oEvent) {
  var oSelectedItem = oEvent.getParameter("listItem");
  if (oSelectedItem) {
    var oContext = oSelectedItem.getBindingContext();
    var sCategory = oContext.getProperty("category");
    var sIcon = oContext.getProperty("icon");
    var sType = oContext.getProperty("type");

    // update model or inputs
    this.getView().getModel().setProperty("/category", sCategory);
    this.getView().getModel().setProperty("/type", sType);
    this.getView().getModel().setProperty("/icon", sIcon);

    this._oValueHelpDialog.close();
  }
},

onValueHelpClose: function() {
  this._oValueHelpDialog.close();
},







































   loadCreateReminderDetails: function () {
      var oModel = new JSONModel({
        title: "",
        description: "",
        isRecurring: false,
        fromDateTime: null,
        toDateTime: null,
        recurringFromDate: null,
        recurringToDate: null,
        recurrenceType: "daily",
        selectedDays: [],
        selectedMonthDays: [],
        previewReminders: [],
        daysOfWeek: [
          { key: "sun", text: "Sunday" },
          { key: "mon", text: "Monday" },
          { key: "tue", text: "Tuesday" },
          { key: "wed", text: "Wednesday" },
          { key: "thu", text: "Thursday" },
          { key: "fri", text: "Friday" },
          { key: "sat", text: "Saturday" }
        ],
        daysOfMonth: Array.from({ length: 31 }, (_, i) => {
          const day = (i + 1).toString();
          return { key: day, text: day };
        })
      });
      this.getView().setModel(oModel, "reminder");
    },

    onOpenReminderDialog: function () {
      var oView = this.getView();

      if (!this._pDialog) {
        this._pDialog = Fragment.load({
          name: "frontEndUI.view.fragment.CreateReminder",
          controller: this
        }).then(function (oDialog) {
          oView.addDependent(oDialog);
          return oDialog;
        });
      }

      this._pDialog.then(function (oDialog) {
        oDialog.open();
      });
    },

    onCloseReminderDialog: function () {
      this._pDialog.then(function (oDialog) {
        oDialog.close();
      });
    },

    onRecurringToggled: function () {
      this.getView().getModel("reminder").setProperty("/previewReminders", []);
    },

    onRecurrenceTypeChange: function () {
      this.getView().getModel("reminder").setProperty("/previewReminders", []);
    },
	onLoadReminders: function () {
  const oModel = this.getView().getModel("reminder");
  const data = oModel.getData();

  const result = [];
  const recurrenceType = data.recurrenceType;

  let fromDate = new Date(data.fromDateTime || data.recurringFromDate);
  let toDate = new Date(data.toDateTime || data.recurringToDate);
// const fromTime = this.convertTo24Hour(data.defaultFromTime || "09:00");
// const toTime = this.convertTo24Hour(data.defaultToTime || "09:30");
 if (!fromDate || !toDate) {
    sap.m.MessageToast.show("Please provide both From  and To date.");
    return
}
const fromTimePicker = sap.ui.getCore().byId("fromTimePicker");
const toTimePicker = sap.ui.getCore().byId("toTimePicker");

const fromTimeDate = fromTimePicker.getDateValue();
const toTimeDate = toTimePicker.getDateValue();
if (!fromTimeDate || !toTimeDate) {
    sap.m.MessageToast.show("Please provide both From Time and To Time.");
    return
}

// Convert to HH:mm:ss
const fromTime = fromTimeDate.toTimeString().slice(0, 8)|| "09:00"; // e.g. "09:00:00"
const toTime = toTimeDate.toTimeString().slice(0, 8)|| "09:30";     // e.g. "17:30:00"

  // Defensive: normalize time to start of day
  fromDate.setHours(0, 0, 0, 0);
  toDate.setHours(0, 0, 0, 0);

  const selectedDays = data.selectedDays || [];
  const selectedMonthDays = data.selectedMonthDays || [];

  const weekdayMap = {
    sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6
  };

  for (let d = new Date(fromDate.getTime()); d <= toDate; d.setDate(d.getDate() + 1)) {
    const current = new Date(d.getTime());
    const day = current.getDay(); // 0 (Sun) to 6 (Sat)
    const date = current.getDate(); // 1 to 31

    let include = false;

    if (recurrenceType === "daily") {
      include = true;
    } else if (recurrenceType === "weekly") {
      // Match day by checking if it's in selectedDays
      include = selectedDays.some(key => weekdayMap[key] === day);
    } else if (recurrenceType === "monthly") {
      // Match date (e.g. 1, 15, etc.)
      include = selectedMonthDays.includes(date.toString());
    }

    if (include) {
      const dayName = current.toLocaleDateString(undefined, { weekday: "long" });
      const dateStr = current.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

      const isoDate = current.toISOString().split("T")[0];
    //   const defaultTime = `${isoDate}T09:00:00`;
    //   const defaultEndTime = `${isoDate}T09:30:00`;
const defaultTime = `${isoDate}T${fromTime}`;
const defaultEndTime = `${isoDate}T${toTime}`;
      result.push({
        dateLabel: `${dateStr} (${dayName})`,
        fromTime: defaultTime,
        toTime: defaultEndTime
      });
    }
  }

  oModel.setProperty("/previewReminders", result);
},
 onDeleteReminderRow: function (oEvent) {
  const oModel = this.getView().getModel("reminder");
  const aReminders = oModel.getProperty("/previewReminders");

  // Get the binding context of the clicked row
  const oCtx = oEvent.getSource().getBindingContext("reminder");
  const sPath = oCtx.getPath(); // e.g. "/previewReminders/2"

  // Extract index from path
  const index = parseInt(sPath.split("/").pop(), 10);

  if (!isNaN(index)) {
    aReminders.splice(index, 1); // Remove item at index
    oModel.setProperty("/previewReminders", aReminders); // Update model
  }
},


 onSaveReminder: function () {
  const oReminderModel = this.getView().getModel("reminder");
  const oData = oReminderModel.getData();

  var payload = {   
	title: oData.title,
    description: oData.description,	
    type: this.getView().getModel().getProperty("/type") 
	};

  if (!payload.title || !payload.type) {
    sap.m.MessageToast.show("Please enter required fields: Title and Type");
    return;
  }

  if (oData.isRecurring) {
    const reminders = (oData.previewReminders || []).map(reminder => {
		 // Extract the date from the 'fromTime' (YYYY-MM-DD)
 	const originalDate = new Date(reminder.fromTime.split("T")[0]); // "2025-06-01"
    originalDate.setDate(originalDate.getDate() + 1); // +1 day

    const dateStr = originalDate.toISOString().split("T")[0]; // "2025-06-02"



    // Extract just the time part (HH:mm:ss)
    const fromTimeStr = reminder.fromTime.split("T")[1];
    const toTimeStr = reminder.toTime.split("T")[1];

      return {		
		 username: "praveen",
		title: oData.title,
		description: oData.description,
		icon: this.getView().getModel().getProperty("/icon") ,
		type: this.getView().getModel().getProperty("/type"),
        fromDateTime: new Date(`${dateStr}T${fromTimeStr}`).toISOString(),
      	toDateTime: new Date(`${dateStr}T${toTimeStr}`).toISOString()
      };
    });

    if (reminders.length === 0) {
      sap.m.MessageToast.show("Please load preview reminders first.");
      return;
    }

    payload = reminders;
  } else {
    if (!oData.fromDateTime || !oData.toDateTime) {
      sap.m.MessageToast.show("Please provide From and To date/time.");
      return;
    }
  payload = [{
    username: "praveen",
    title: oData.title,
    description: oData.description,
    icon: this.getView().getModel().getProperty("/icon") ,
    type: this.getView().getModel().getProperty("/type") ,

 fromDateTime : new Date(oData.fromDateTime).toISOString(),
   toDateTime : new Date(oData.toDateTime).toISOString()
	 }];
  }

  // 👇 Here you have your final JSON
  //console.log("Final JSON Payload:", JSON.stringify(payload, null, 2));
  this.insertEvents(payload);

  // Optionally: Send to backend or close dialog
  // this.sendToBackend(payload);
  ///this.onCloseReminderDialog();
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












// table
onEditSelectedRows: function () {
  const oTable = this.getView().byId("remindersTable");
  const aSelectedItems = oTable.getSelectedItems();

  if (aSelectedItems.length === 0) {
    sap.m.MessageToast.show("Please select at least one row to edit.");
    return;
  }

  const oModel = this.getView().getModel("reminders");
  const aData = oModel.getData();

  // Reset all rows to not editable first
  aData.forEach(item => item._isEditable = false);

  // Make only selected rows editable
  aSelectedItems.forEach(oItem => {
    const iIndex = oTable.indexOfItem(oItem);
    if (iIndex > -1) {
      aData[iIndex]._isEditable = true;
    }
  });

  oModel.setData(aData);
  this.byId("submitBtn").setVisible(true);
  this.byId("cancelBtn").setVisible(true);
},


onCancelEdit: function () {
   this.getCalenderEvents(); // Reload from backend
  this.getView().byId("submitBtn").setVisible(false);
  this.getView().byId("cancelBtn").setVisible(false);
},onSubmitChanges: function () {
  const oModel = this.getView().getModel("reminders");
  const data = oModel.getData();

  const editedRows = data.filter(item => item._isEditable);

  if (editedRows.length === 0) {
    sap.m.MessageToast.show("No changes to submit.");
    return;
  }

  const payload = editedRows.map(({ _isEditable, ...clean }) => clean);
console.log(payload)
return
  $.ajax({
    url: "/oData/v1/CalenderService/updateEvents", // adjust to your backend
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(payload),
    success: (res) => {
      if (res.status === "success") {
        sap.m.MessageToast.show("Updated successfully.");
        this.getCalenderEvents();
        this.byId("submitBtn").setVisible(false);
        this.byId("cancelBtn").setVisible(false);
      }
    }
  });
}
,onDeleteSelected: function () {
  const oTable = this.getView().byId("remindersTable");
  const aSelectedItems = oTable.getSelectedItems();

  if (aSelectedItems.length === 0) {
    sap.m.MessageToast.show("Select at least one row to delete.");
    return;
  }

  const oModel = this.getView().getModel("reminders");
  const aData = oModel.getData();

  const idsToDelete = aSelectedItems.map(oItem => {
    const iIndex = oTable.indexOfItem(oItem);
    return aData[iIndex].id;
  });
console.log(idsToDelete)
   $.ajax({
    url: "/oData/v1/CalenderService/deleteEvents", // replace with your actual delete URL
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({ ids: idsToDelete }),
    success: (res) => {
      if (res.status === "success") {
        sap.m.MessageToast.show("Deleted successfully.");
        this.getCalenderEvents();
      }
    }
  });
}










 






    });
  });