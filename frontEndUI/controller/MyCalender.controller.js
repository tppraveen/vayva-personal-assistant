
sap.ui.define([
	"frontEndUI/controller/BaseController",
	"sap/ui/core/mvc/Controller",
	"frontEndUI/model/formatter",
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
	BaseController,Controller,formatter,BusyIndicator,Filter,FilterOperator,MessageToast,MessageBox,Dialog,Fragment,CMSModel,StandardTile,TileContainer,Spreadsheet,JSONModel,unifiedLibrary,coreLibrary,DateFormat,mobileLibrary,UI5Date,CustomListItem
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
        this.setModel()
		this.getCalenderTypes();
		this.getCalenderRef();

		let oTodayDateTime = UI5Date.getInstance(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
		this.getView().getModel().setProperty("/startDate",oTodayDateTime)
      },
	  getCalenderTypes:function(){
			var aTypes = 
 [
  {
    "type": "Type01",
    "category": "Work/Study",
    "icon": "sap-icon://study-leave",
    "exampleTitle": "Online Course: JavaScript",
    "description": "Study sessions, work blocks",
    "color": "#1E90FF"
  },
  {
    "type": "Type02",
    "category": "Exercise",
    "icon": "sap-icon://activity-items",
    "exampleTitle": "Morning Run",
    "description": "Any physical activity or gym",
    "color": "#32CD32"
  },
  {
    "type": "Type03",
    "category": "Meal",
    "icon": "sap-icon://meal",
    "exampleTitle": "Lunch with Anna",
    "description": "Meals, social dining",
    "color": "#FFA500"
  },
  {
    "type": "Type04",
    "category": "Reminder",
    "icon": "sap-icon://bell",
    "exampleTitle": "Pay Credit Card Bill",
    "description": "To-do, tasks, payments",
    "color": "#FF4500"
  },
  {
    "type": "Type05",
    "category": "Personal Project",
    "icon": "sap-icon://create-form",
    "exampleTitle": "Write Blog Post",
    "description": "Side projects, hobbies",
    "color": "#8A2BE2"
  },
  {
    "type": "Type06",
    "category": "Event",
    "icon": "sap-icon://calendar",
    "exampleTitle": "Friend’s Birthday",
    "description": "Birthdays, events, celebrations",
    "color": "#FF69B4"
  },
  {
    "type": "Type07",
    "category": "Travel",
    "icon": "sap-icon://flight",
    "exampleTitle": "Trip to Mountains",
    "description": "Personal trips",
    "color": "#00CED1"
  },
  {
    "type": "Type08",
    "category": "Family",
    "icon": "sap-icon://family-care",
    "exampleTitle": "Call Parents",
    "description": "Family time or events",
    "color": "#FFD700"
  },
  {
    "type": "Type09",
    "category": "Reading",
    "icon": "sap-icon://open-book",
    "exampleTitle": "Read: Atomic Habits",
    "description": "Dedicated reading time",
    "color": "#7FFF00"
  },
  {
    "type": "Type10",
    "category": "Meditation",
    "icon": "sap-icon://umbrella",
    "exampleTitle": "Evening Meditation",
    "description": "Self-care, reflection",
    "color": "#40E0D0"
  },
  {
    "type": "Type11",
    "category": "Health",
    "icon": "sap-icon://stethoscope",
    "exampleTitle": "Doctor Appointment",
    "description": "Health checkups, medication",
    "color": "#DC143C"
  },
  {
    "type": "Type12",
    "category": "Finance",
    "icon": "sap-icon://money-bills",
    "exampleTitle": "Budget Review",
    "description": "Bills, budgeting",
    "color": "#228B22"
  },
  {
    "type": "Type13",
    "category": "Cleaning",
    "icon": "sap-icon://washing-machine",
    "exampleTitle": "Clean Kitchen",
    "description": "Chores, housework",
    "color": "#D2691E"
  },
  {
    "type": "Type14",
    "category": "Groceries",
    "icon": "sap-icon://cart",
    "exampleTitle": "Weekly Grocery Run",
    "description": "Shopping, errands",
    "color": "#FF8C00"
  },
  {
    "type": "Type15",
    "category": "Entertainment",
    "icon": "sap-icon://video",
    "exampleTitle": "Watch Movie",
    "description": "Leisure, TV, social fun",
    "color": "#BA55D3"
  },
  {
    "type": "Type16",
    "category": "Sleep/Rest",
    "icon": "sap-icon://bed",
    "exampleTitle": "Nap Time",
    "description": "Rest time, night sleep",
    "color": "#1E90FF"
  },
  {
    "type": "Type17",
    "category": "Goals",
    "icon": "sap-icon://goal",
    "exampleTitle": "Track Monthly Goals",
    "description": "Goal check-ins",
    "color": "#32CD32"
  },
  {
    "type": "Type18",
    "category": "Journaling",
    "icon": "sap-icon://notes",
    "exampleTitle": "Write in Journal",
    "description": "Journaling, diary time",
    "color": "#FF69B4"
  },
  {
    "type": "Type19",
    "category": "Gardening",
    "icon": "sap-icon://tree",
    "exampleTitle": "Water the plants",
    "description": "Nature, hobbies",
    "color": "#228B22"
  },
  {
    "type": "Type20",
    "category": "Volunteer / Social",
    "icon": "sap-icon://employee",
    "exampleTitle": "Help at Shelter",
    "description": "Giving back, social events",
    "color": "#FF6347"
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
        	setModel: function() {
			var oModel = new JSONModel();
			oModel.setData({
					appointments: [
						 {
						title: "Discussion of the plan",
						text: "Online meeting with partners and colleagues",
						type: CalendarDayType.Type01,
						icon: "sap-icon://home",
						tentative: true,
						startDate: UI5Date.getInstance("2025", "5", "14", "11", "30"),
						endDate: UI5Date.getInstance("2025", "5", "14", "13", "00")
					},
						 {
						title: "Discussion3 of the plan",
						text: "Online meeting with partners and colleagues",
						type: CalendarDayType.Type01,
  						startDate: UI5Date.getInstance("2025", "5", "14", "11", "30"),
						endDate: UI5Date.getInstance("2025", "5", "14", "13", "00")
					},
						 {
						title: "Discussion3 of the plan",
						text: "Online meeting with partners and colleagues",
						type: CalendarDayType.Type01,
						icon: "sap-icon://home", 
						startDate: UI5Date.getInstance("2025", "5", "14", "11", "30"),
						endDate: UI5Date.getInstance("2025", "5", "14", "13", "00")
					},
					{
						title: "Type5 Check all days 1tp",
						type: CalendarDayType.Type5,
						startDate: UI5Date.getInstance("2025", "5", "14"),
						endDate: UI5Date.getInstance("2025", "5", "19")
					},{
						title: "Type1 chk time2 tp",
						type: CalendarDayType.Type20,
						startDate: UI5Date.getInstance("2025", "5", "14", "11", "50"),
						endDate: UI5Date.getInstance("2025", "5", "14", "14", "0")
					},{
						title: "Type2",
						type: CalendarDayType.Type18,
						startDate: UI5Date.getInstance("2025", "5", "12", "22", "01"),
						endDate: UI5Date.getInstance("2025", "5", "12", "22", "10")
					},{
						title: "Meet John Miller",
						type: CalendarDayType.Type05,
						startDate: UI5Date.getInstance("2025", "5", "11", "5", "0"),
						endDate: UI5Date.getInstance("2025", "5", "11", "6", "0")
					}, {
						title: "Discussion of the plan",
						type: CalendarDayType.Type01,
						startDate: UI5Date.getInstance("2025", "5", "11", "6", "0"),
						endDate: UI5Date.getInstance("2025", "5", "11", "7", "9")
					}, {
						title: "Lunch",
						text: "canteen",
						type: CalendarDayType.Type01,
						startDate: UI5Date.getInstance("2025", "5", "11", "7", "0"),
						endDate: UI5Date.getInstance("2025", "5", "11", "8", "0")
					}, {
						title: "New Product",
						text: "room 105",
						type: CalendarDayType.Type01,
						icon: "sap-icon://meeting-room",
						startDate: UI5Date.getInstance("2025", "5", "11", "8", "0"),
						endDate: UI5Date.getInstance("2025", "5", "11", "9", "0")
					}, {
						title: "Team meeting",
						text: "Regular",
						type: CalendarDayType.Type01,
						icon: "sap-icon://home",
						startDate: UI5Date.getInstance("2025", "5", "11", "9", "9"),
						endDate: UI5Date.getInstance("2025", "5", "11", "10", "0")
					}, {
						title: "Discussion with clients regarding our new purpose",
						text: "room 234 and Online meeting",
						type: CalendarDayType.Type08,
						icon: "sap-icon://home",
						startDate: UI5Date.getInstance("2025", "5", "11", "10", "0"),
						endDate: UI5Date.getInstance("2025", "5", "11", "11", "30")
					}, {
						title: "Discussion of the plan",
						text: "Online meeting with partners and colleagues",
						type: CalendarDayType.Type01,
						icon: "sap-icon://home",
						tentative: true,
						startDate: UI5Date.getInstance("2025", "5", "11", "11", "30"),
						endDate: UI5Date.getInstance("2025", "5", "11", "13", "00")
					}, {
						title: "Discussion with clients",
						type: CalendarDayType.Type08,
						icon: "sap-icon://home",
						startDate: UI5Date.getInstance("2025", "5", "11", "12", "30"),
						endDate: UI5Date.getInstance("2025", "5", "11", "13", "15")
					}, {
						title: "Meeting with the manager",
						type: CalendarDayType.Type03,
						startDate: UI5Date.getInstance("2025", "5", "11", "13", "9"),
						endDate: UI5Date.getInstance("2025", "5", "11", "13", "9")
					}, {
						title: "Meeting with the HR",
						type: CalendarDayType.Type03,
						startDate: UI5Date.getInstance("2025", "5", "11", "14", "0"),
						endDate: UI5Date.getInstance("2025", "5", "11", "14", "15")
					}, {
						title: "Call with customer",
						type: CalendarDayType.Type08,
						startDate: UI5Date.getInstance("2025", "5", "11", "14", "15"),
						endDate: UI5Date.getInstance("2025", "5", "11", "14", "30")
					}, {
						title: "Prepare documentation",
						text: "At my desk",
						icon: "sap-icon://meeting-room",
						type: CalendarDayType.Type03,
						startDate: UI5Date.getInstance("2025", "5", "11", "14", "10"),
						endDate: UI5Date.getInstance("2025", "5", "11", "15", "30")
					}, {
						title: "Meeting with the manager",
						type: CalendarDayType.Type03,
						startDate: UI5Date.getInstance("2025", "6", "9", "6", "30"),
						endDate: UI5Date.getInstance("2025", "6", "9", "7", "0")
					}, {
						title: "Lunch",
						type: CalendarDayType.Type05,
						startDate: UI5Date.getInstance("2025", "6", "9", "7", "0"),
						endDate: UI5Date.getInstance("2025", "6", "9", "8", "0")
					}, {
						title: "Team meeting",
						text: "online",
						type: CalendarDayType.Type01,
						startDate: UI5Date.getInstance("2025", "6", "9", "8", "0"),
						endDate: UI5Date.getInstance("2025", "6", "9", "9", "0")
					}, {
						title: "Discussion with clients for the new release dates",
						text: "Online meeting",
						type: CalendarDayType.Type08,
						startDate: UI5Date.getInstance("2025", "6", "9", "9", "0"),
						endDate: UI5Date.getInstance("2025", "6", "9", "10", "0")
					}, {
						title: "Team meeting",
						text: "room 5",
						type: CalendarDayType.Type01,
						startDate: UI5Date.getInstance("2025", "6", "9", "11", "0"),
						endDate: UI5Date.getInstance("2025", "6", "9", "14", "0")
					}, {
						title: "Daily standup meeting",
						type: CalendarDayType.Type01,
						startDate: UI5Date.getInstance("2025", "6", "9", "9", "0"),
						endDate: UI5Date.getInstance("2025", "6", "9", "9", "15", "0")
					}, {
						title: "Private meeting",
						type: CalendarDayType.Type03,
						startDate: UI5Date.getInstance("2025", "6", "11", "9", "9"),
						endDate: UI5Date.getInstance("2025", "6", "11", "9", "20")
					}, {
						title: "Private meeting",
						type: CalendarDayType.Type03,
						startDate: UI5Date.getInstance("2025", "6", "10", "6", "0"),
						endDate: UI5Date.getInstance("2025", "6", "10", "7", "0")
					}, {
						title: "Meeting with the manager",
						type: CalendarDayType.Type03,
						startDate: UI5Date.getInstance("2025", "6", "10", "15", "0"),
						endDate: UI5Date.getInstance("2025", "6", "10", "15", "30")
					}, {
						title: "Meet John Doe",
						type: CalendarDayType.Type05,
						icon: "sap-icon://home",
						startDate: UI5Date.getInstance("2025", "6", "11", "7", "0"),
						endDate: UI5Date.getInstance("2025", "6", "11", "7", "30")
					}, {
						title: "Team meeting",
						text: "online",
						type: CalendarDayType.Type01,
						startDate: UI5Date.getInstance("2025", "6", "11", "8", "0"),
						endDate: UI5Date.getInstance("2025", "6", "11", "9", "30")
					}, {
						title: "Workshop",
						type: CalendarDayType.Type05,
						startDate: UI5Date.getInstance("2025", "6", "11", "8", "30"),
						endDate: UI5Date.getInstance("2025", "6", "11", "12", "0")
					}, {
						title: "Team collaboration",
						type: CalendarDayType.Type01,
						startDate: UI5Date.getInstance("2025", "6", "12", "4", "0"),
						endDate: UI5Date.getInstance("2025", "6", "12", "12", "30")
					}, {
						title: "Out of the office",
						type: CalendarDayType.Type05,
						startDate: UI5Date.getInstance("2025", "6", "12", "15", "0"),
						endDate: UI5Date.getInstance("2025", "6", "12", "19", "30")
					}, {
						title: "Working out of the building",
						type: CalendarDayType.Type05,
						startDate: UI5Date.getInstance("2025", "6", "12", "20", "0"),
						endDate: UI5Date.getInstance("2025", "6", "12", "21", "30")
					}, {
						title: "Vacation",
						type: CalendarDayType.Type09,
						text: "out of office",
						startDate: UI5Date.getInstance("2025", "6", "11", "12", "0"),
						endDate: UI5Date.getInstance("2025", "6", "13", "14", "0")
					}, {
						title: "Reminder",
						type: CalendarDayType.Type09,
						startDate: UI5Date.getInstance("2025", "6", "12", "00", "00"),
						endDate: UI5Date.getInstance("2025", "6", "13", "00", "00")
					}, {
						title: "Team collaboration",
						type: CalendarDayType.Type01,
						startDate: UI5Date.getInstance("2025", "6", "6", "00", "00"),
						endDate:  UI5Date.getInstance("2025", "6", "16", "00", "00")
					}, {
						title: "Workshop out of the country",
						type: CalendarDayType.Type05,
						startDate: UI5Date.getInstance("2025", "6", "14", "00", "00"),
						endDate: UI5Date.getInstance("2025", "6", "20", "00", "00")
					}, {
						title: "Payment reminder",
						type: CalendarDayType.Type09,
						startDate: UI5Date.getInstance("2025", "6", "7", "00", "00"),
						endDate: UI5Date.getInstance("2025", "5", "11", "00", "00")
					}, {
						title:"Meeting with the manager",
						type: CalendarDayType.Type03,
						startDate: UI5Date.getInstance("2025", "6", "6", "9", "0"),
						endDate: UI5Date.getInstance("2025", "6", "6", "10", "0")
					}, {
						title:"Daily standup meeting",
						type: CalendarDayType.Type01,
						startDate: UI5Date.getInstance("2025", "6", "7", "10", "0"),
						endDate: UI5Date.getInstance("2025", "6", "7", "10", "30")
					}, {
						title:"Private meeting",
						type: CalendarDayType.Type03,
						startDate: UI5Date.getInstance("2025", "6", "6", "11", "30"),
						endDate: UI5Date.getInstance("2025", "6", "6", "12", "0")
					}, {
						title:"Lunch",
						type: CalendarDayType.Type05,
						startDate: UI5Date.getInstance("2025", "6", "6", "12", "0"),
						endDate: UI5Date.getInstance("2025", "6", "6", "13", "0")
					}, {
						title:"Discussion of the plan",
						type: CalendarDayType.Type01,
						startDate: UI5Date.getInstance("2025", "6", "16", "11", "0"),
						endDate: UI5Date.getInstance("2025", "6", "16", "12", "0")
					}, {
						title:"Lunch",
						text: "canteen",
						type: CalendarDayType.Type05,
						startDate: UI5Date.getInstance("2025", "6", "16", "12", "0"),
						endDate: UI5Date.getInstance("2025", "6", "16", "13", "0")
					}, {
						title:"Team meeting",
						text: "room 200",
						type: CalendarDayType.Type01,
						icon: "sap-icon://meeting-room",
						startDate:  UI5Date.getInstance("2025", "6", "16", "16", "0"),
						endDate: UI5Date.getInstance("2025", "6", "16", "17", "0")
					}, {
						title:"Discussion with clients",
						text: "Online meeting",
						type: CalendarDayType.Type08,
						icon: "sap-icon://home",
						startDate: UI5Date.getInstance("2025", "6", "17", "15", "30"),
						endDate: UI5Date.getInstance("2025", "6", "17", "16", "30")
					}
				]
			});

			this.getView().setModel(oModel);

			oModel = new JSONModel();
			oModel.setData({allDay: false});
			this.getView().setModel(oModel, "allDay");

			oModel = new JSONModel();
			oModel.setData({ stickyMode: StickyMode.None, enableAppointmentsDragAndDrop: true, enableAppointmentsResize: true, enableAppointmentsCreate: true });
			this.getView().setModel(oModel, "settings");
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

    // update model or inputs
    this.getView().getModel().setProperty("/category", sCategory);
    this.getView().getModel().setProperty("/icon", sIcon);

    this._oValueHelpDialog.close();
  }
},

onValueHelpClose: function() {
  this._oValueHelpDialog.close();
}












    });
  });