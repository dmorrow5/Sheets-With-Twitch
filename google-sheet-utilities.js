// Google Docs Vars
const { google } = require('googleapis');
const sheets = google.sheets('v4');
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const googleCreds = require('./service_account_creds.json');

// Google Sheet API Methods
async function getAuthToken() {
    const auth = new google.auth.GoogleAuth({
      scopes: SCOPES
    });
    const jsonCreds = googleCreds;
    const authToken = await auth.fromJSON(jsonCreds);
    return authToken;
  }
  
  async function getSpreadSheet({spreadsheetId, auth}) {
    const res = await sheets.spreadsheets.get({
      spreadsheetId,
      auth,
    });
    return res;
  }
  
  async function getSpreadSheetValues({spreadsheetId, auth, sheetName}) {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      auth,
      range: sheetName
    });
    return res;
  }
  
  async function updateSpreadSheetValues({spreadsheetId, auth, range, arrayValues}) {
    let updateOptions = {
        spreadsheetId,
        auth,
        valueInputOption: 'USER_ENTERED',
        range: range,
        resource: { values: arrayValues }
      }
    
    const res = await sheets.spreadsheets.values.update(updateOptions);
    
    return res;
  }
  
  module.exports = {
    getAuthToken,
    getSpreadSheet,
    getSpreadSheetValues,
    updateSpreadSheetValues
  }