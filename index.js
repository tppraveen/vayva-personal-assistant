// const express = require("express");
// const app = express();

// const port = process.env.PORT || 3000;

// app.use(express.static("frontEndUI"));

// app.get("/hello", (req, res) => {
//   res.json({ message: "Hello from Node.js backend!" });
// });

// app.listen(port, () => {
//   console.log(`App listening at http://localhost:${port}`);
// });

const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const dataRoutes = require('./routes/dataRoutes');
const handleError = require('./utils/errorHandler');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontEndUI')));

 
 
const nodeApiVersion = "/oData/v1";
app.use(nodeApiVersion+'/api/data', dataRoutes);
const oUserServicePrefix = nodeApiVersion+"/UserServices";
const oExpenseServicePrefix = nodeApiVersion+"/ExpenseServices";
const oExpenseConfigServicePrefix = nodeApiVersion+"/ExpenseCategoryConfigServices";
const ooReminderServicePrefix = nodeApiVersion+"/oReminderServices";
 
app.get(nodeApiVersion+'/api/data/users',dataRoutes.getAppHomeMenuTiles);



//////////////////////////// User login
const oUserService = require('./routes/UserService');
app.get(oUserServicePrefix,oUserService.oUserServices);
app.post(oUserServicePrefix+'/validateLoginUser',oUserService.validateLoginUser);
app.post(oUserServicePrefix+'/remainderScheduler',oUserService.remainderScheduler);
app.post(oUserServicePrefix+'/getLoginUserMenu',oUserService.getLoginUserMenu);

//////////////////////////// Reminder Service
const oReminderService = require('./routes/ReminderService');
app.get(ooReminderServicePrefix,oReminderService.oReminderServices);
app.post(ooReminderServicePrefix+'/getUpcomingReminders',oReminderService.getUpcomingReminders);
app.post(ooReminderServicePrefix+'/getMissedReminders',oReminderService.getMissedReminders);
app.post(ooReminderServicePrefix+'/markAsCompleted',oReminderService.markAsCompleted);
app.post(ooReminderServicePrefix+'/snoozeReminder',oReminderService.snoozeReminder);
 

 


//////////////////////////// Expense Category ConfigServicen
const oExpenseCategoryConfigService = require('./routes/ExpenseCategoryConfigService');

app.get(oExpenseConfigServicePrefix,oExpenseCategoryConfigService.oExpenseCategoryConfigServices);
app.post(oExpenseConfigServicePrefix+'/getExpenseCategoryConfigListsbyUser',oExpenseCategoryConfigService.getExpenseCategoryConfigListsbyUser);
app.post(oExpenseConfigServicePrefix + '/readExpenseCategoryByID', oExpenseCategoryConfigService.readExpenseCategoryByID);
app.post(oExpenseConfigServicePrefix+'/insertExpenseCategoryConfig',oExpenseCategoryConfigService.insertExpenseCategoryConfig);
app.put(oExpenseConfigServicePrefix+'/updateExpenseCategoryConfig',oExpenseCategoryConfigService.updateExpenseCategoryConfig);
app.delete(oExpenseConfigServicePrefix+'/delete',oExpenseCategoryConfigService.deleteExpenseCategoryConfig);

app.post(oExpenseConfigServicePrefix+'/getCategoryListsByUser',oExpenseCategoryConfigService.getCategoryListsByUser);
app.post(oExpenseConfigServicePrefix+'/getSubCategoryListsByUser',oExpenseCategoryConfigService.getSubCategoryListsByUser);










  
//////////////////////////// Expense  Services
const oExpenseService = require('./routes/ExpenseService');

app.get(oExpenseServicePrefix,oExpenseService.oExpenseServices);
app.post(oExpenseServicePrefix+'/getExpenseListsbyUser',oExpenseService.getExpenseListsbyUser);
app.post(oExpenseServicePrefix + '/readExpenseByID', oExpenseService.readExpenseByID);
app.post(oExpenseServicePrefix+'/insertExpense',oExpenseService.insertExpense);
app.delete(oExpenseServicePrefix + '/deleteExpense', oExpenseService.deleteExpense);
app.post(oExpenseServicePrefix + '/updateExpense/:id', oExpenseService.updateExpense);
app.post(oExpenseServicePrefix + '/getExpenseDashboardSummary', oExpenseService.getExpenseDashboardSummary);















const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
