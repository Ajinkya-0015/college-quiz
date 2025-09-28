const { GoogleSpreadsheet } = require('google-spreadsheet');

// The correction is on this line, changing the function definition syntax
exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);

    // This is the ID for your Google Sheet
    const doc = new GoogleSpreadsheet('1HN-tX3xKNHdWkC9ZAGKxGSlAUp352t2PpWO9ChL2U2g'); 

    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });

    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    // Add a new row with the data from the quiz
    await sheet.addRow({
      Timestamp: new Date().toLocaleString("en-IN", {timeZone: "Asia/Kolkata"}),
      Name: data.name,
      HollandCode: data.score, // The "score" we sent is the Holland Code
    });

    return { 
      statusCode: 200, 
      body: JSON.stringify({ message: "Success" }) 
    };

  } catch (error) {
    console.error(error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ message: "Error processing the submission." }) 
    };
  }
};
