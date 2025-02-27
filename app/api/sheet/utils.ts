import { google } from "googleapis";

import path from "path";

const sheets = google.sheets('v4');

// Google api credentials
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Google api constants
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// const CREDENTIAL_PATH= path.join(process.cwd(), "./secret.json");
// const CREDENTIAL_PATH= path.resolve("secret.json");
const CREDENTIAL_PATH = path.join(process.cwd(), 'secret.json');
const sheetId = '17QAMB0mflPwJLIdw455YCwRNjsEthlgI1IKYaNTj-r0'
const tabName = 'Sheet1'
const range = 'A:C'

class Sheet {
  auth: any;

  constructor(){
    const auth = new google.auth.GoogleAuth({
      scopes: SCOPES,
      keyFile: CREDENTIAL_PATH
    });

    Promise.resolve(auth.getClient())
    .then(res => {
      this.auth = res
    })
  }

  getSpreadSheet = async() => {
    const res = await sheets.spreadsheets.get({
      spreadsheetId: sheetId,
    });
    return res;
  }

  getSheetValues = async() => {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      auth: this.auth,
      range: tabName
    });
    return res?.data?.values;
  }

  writeSheet = async(data: any) => {
    if(!this.auth){
      return;
    }
    const payload = {
      auth: this.auth,
      spreadsheetId: sheetId,
      range: `${tabName}!${range}`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        "majorDimension": "ROWS",
        "values": data
      },
    }
    await sheets.spreadsheets.values.append(payload)
  }
}

export default new Sheet();
