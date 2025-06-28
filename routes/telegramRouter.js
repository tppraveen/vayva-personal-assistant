// routes/TelegramService.js

const { sendMessage } = require("../services/telegramService");

 


const pool = require('../db');






















let pendingReminderPayload = null; // Store pending reminder between calls (in-memory for demo)

const { handleBotMessage } = require('./bot/handleBotMessage');



const telegramWebhook = async (req, res) => {
  const message = req.body.message;
  if (!message || !message.text) return res.sendStatus(200);

  const chatId = message.chat.id;
  const text = message.text.trim();

  const response = await handleBotMessage(chatId, text);

  if (Array.isArray(response)) {
    for (const msg of response) {
      await sendMessage(chatId, msg);
    }
  } else {
    await sendMessage(chatId, response);
  }

  res.sendStatus(200);
};
// const telegramWebhook = async (req, res) => {
//   console.log("📩 Incoming webhook payload:", JSON.stringify(req.body));
//   const message = req.body.message;

//   if (message && message.text) {
//     const chatId = message.chat.id;
//     const text = message.text.trim();

//     console.log(`Received message from chatId ${chatId}: ${text}`);

//     if (text.toLowerCase() === "yes" && pendingReminderPayload) {
//       // User confirmed reminder save
//       try {
//        // await insertEvents(pendingReminderPayload);
//         await sendMessage(chatId, "✅ Reminder saved successfully!");
//         pendingReminderPayload = null;
//       } catch (error) {
//         await sendMessage(chatId, `❌ Error saving reminder: ${error.message}`);
//       }
//       return res.sendStatus(200);
//     }

//     if (text.toLowerCase().startsWith("create reminder")) {
//       const response = handleBotLogic(text);
//       // If response is string => send that as message (confirmation or error)
//       if (typeof response === "string") {
//         await sendMessage(chatId, response);
//       } else if (Array.isArray(response)) {
//         // It's payload awaiting confirmation
//         pendingReminderPayload = response;
//         await sendMessage(chatId, "Got your reminder! Please reply 'Yes' to save it.");
//       } else {
//         await sendMessage(chatId, "Sorry, I couldn't process your reminder.");
//       }
//     } else {
//       await sendMessage(chatId, `P-Bot: ${text}`); // Echo fallback
//     }
//   }

//   res.sendStatus(200);
// };

// Parses input, returns confirmation string or payload array
function handleBotLogic(sMessage) {
  function parseDate(str) {
    const today = new Date();
    const dayMap = {
      today: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      tomorrow: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
      yesterday: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)
    };
    str = str.toLowerCase();
    if (dayMap[str]) return dayMap[str];
    const parsed = new Date(str);
    return isNaN(parsed) ? null : parsed;
  }

  function formatToISO(date, timeStr) {
    if (!date || !timeStr) return "";
    let meridian = timeStr.toLowerCase().includes("pm") ? "pm" : "am";
    let hourMin = timeStr.toLowerCase().replace(/am|pm/, "").trim();
    let [h, m = "0"] = hourMin.split(":");
    h = parseInt(h);
    m = parseInt(m);
    if (meridian === "pm" && h < 12) h += 12;
    if (meridian === "am" && h === 12) h = 0;
    date.setHours(h, m, 0, 0);
    return date.toISOString();
  }

  let result = {
    title: "",
    description: "",
    fromDateTime: "",
    toDateTime: "",
    username: "praveen",
    type: "Type07",
    icon: "sap-icon://appointment-2"
  };

  let lowerMsg = sMessage.toLowerCase();
  if (lowerMsg.startsWith("create reminder")) {
    let messageBody = sMessage.substring("create reminder".length).trim();

    // Detect 'for', 'from', 'to' keywords
    let forIndex = messageBody.indexOf(" for ");
    let fromIndex = messageBody.indexOf(" from ");

    if (fromIndex !== -1) {
      // Extract title (before "for" or before "from")
      result.title = messageBody.substring(0, forIndex !== -1 ? forIndex : fromIndex).trim();

      // Extract description (between "for" and "from")
      result.description = forIndex !== -1
        ? messageBody.substring(forIndex + 5, fromIndex).trim()
        : "";

      let datetimeStr = messageBody.substring(fromIndex + 6).trim();
      let toIndex = datetimeStr.indexOf(" to ");

      if (toIndex !== -1) {
        let fromRaw = datetimeStr.substring(0, toIndex).trim();
        let toRaw = datetimeStr.substring(toIndex + 4).trim();

        let fromParts = fromRaw.split(" ");
        let toParts = toRaw.split(" ");

        let fromDate = parseDate(fromParts[0]);
        let toDate = parseDate(toParts[0]);

        result.fromDateTime = formatToISO(fromDate, fromParts.slice(1).join(" "));
        result.toDateTime = formatToISO(toDate, toParts.slice(1).join(" "));
      }
    }

    if (!result.title || !result.fromDateTime || !result.toDateTime) {
      return "Sorry, I couldn't understand your reminder completely. Please use the format: 'create reminder [title] for [description] from [date time] to [date time]'";
    }

    return [result]; // Return array payload awaiting confirmation
  }

  return sMessage; // fallback, just echo
}

// Example insertEvents function
async function insertEvents(payload) {
  // Replace this with your actual DB or API call to save reminder
  console.log("Saving reminder payload:", JSON.stringify(payload, null, 2));
  return Promise.resolve(); // simulate async success
}



const sendTelegramMessage = async (req, res) => {
    const { chatId, message } = req.body;

    if (!chatId || !message) {
        return res.status(400).json({ error: "chatId and message are required" });
    }

    try {
        const result = await sendMessage(chatId, message);
        res.status(200).json(result);
    } catch (err) {
        console.error("Send Message Error:", err.message || err);
        res.status(500).json({
            error: "Failed to send message",
            details: err.message || "Unknown error"
        });
    }
};
const insertCalenderEventstoDB = async (event) => {
  try {
     const { title,description,fromDateTime,toDateTime,username,type,icon} = event;

    const query = `
      INSERT INTO dummytable (id, name)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const values = [123, fromDateTime];
  const result = await pool.query(query, values);
    return "Inserted into Calender Successfully.";
  } catch (error) {
    
    console.error("DB Insert Error:", error);
    // throw error;
    return "DB Error : Not Inserted into Calender.";

  }
}; 
const getTop5CalendarEventsAsText = async (requests) => {
  const { username,limit,offset} = requests;

  try {
    const query = `
      SELECT *
      FROM calenderevents  where username=$1
      ORDER BY startdate DESC 
      LIMIT $2 OFFSET $3;
    `;
    const values =[username,limit,offset]
    const result = await pool.query(query,values);

    if (result.rows.length === 0) {
      return "No calendar events found.";
    }

    const formattedText = result.rows
      .map((row, index) => {
   const start = moment(item.startDate).tz('Asia/Kolkata').format('D MMMM [at] h:mm A');
                  const end = moment(item.endDate).tz('Asia/Kolkata').format('h:mm A');
               

      return `${index + offset+1}. ${row.title}:${row.description} -
       ${start}-${end} `})
      .join('\n');

    return formattedText;

  } catch (error) {
    console.error("DB Fetch Error:", error);
    return "DB Error: Could not retrieve calendar events.";
  }
};
const getISTTimeFormat = (startdate)=>{
 

// Create a Date object in UTC
const date = new Date(startdate);

// Convert to IST (UTC+5:30)
const istOffset = 5.5 * 60 * 60 * 1000; // milliseconds
const istDate = new Date(date.getTime() + istOffset);

// Format as dd/mm/yyyy HH MM
const dd = String(istDate.getDate()).padStart(2, '0');
const mm = String(istDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
const yyyy = istDate.getFullYear();
const HH = String(istDate.getHours()).padStart(2, '0');
const MM = String(istDate.getMinutes()).padStart(2, '0');

return formatted = `${dd}/${mm}/${yyyy} ${HH}:${MM}`;



};

const testInsertEvents = async (req, res) => {
  
    try {
//       var oPayload= {
//   title: "dummy",
//   description:  '',
//   fromDateTime:new Date().toISOString(),
//   toDateTime:new Date().toISOString(),
//   username: 'praveen123',
//   type: 'Type07',
//   icon: 'sap-icon://appointment-2'
// }
      var oPayload= {
  username: 'praveen',limit :5,offset:1
}

        //const result = await insertCalenderEventstoDB(oPayload);
        const result = await getTop5CalendarEventsAsText(oPayload);
        
        res.status(200).json({
          message: "Inserted into dummy_table successfully",
          data: result
        });
    } catch (err) {
        console.error("Send Message Error:", err.message || err);
        res.status(500).json({
            error: "Failed to send message",
            details: err.message || "Unknown error"
        });
    }
};
module.exports = {
    sendTelegramMessage,
    telegramWebhook,
    testInsertEvents
};



// Reference Start 



// End