require("dotenv").config(); // Allows your app to access your .env file

const express = require('express');
const app = express();
const tmi = require("tmi.js"); // Twitch Chat Bot API
const googleSheetUtilities = require('./google-sheet-utilities.js');
const spreadsheetId = process.env.SPREADSHEETID;

const chatViewer = require('./chat-viewer.js');
const {
  VIEWERNAME_COLUMN,
  sheetName,
  channelName,
  helloCommand,
  createCommand,
  testAdmingCommand,
  infoCommand,
  viewerCommand,
  commandsCommand,
  addPointsCommand
} = require('./constants.js');

console.log('Imports complete');

// The page shows the same information as the readme and includes the remix button.
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/index.html');
});

let listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

console.log('index.html is now hosted - see console for port and use url="localhost:[PortNumber]"');

// Setting options for our bot, disable debug output once your up and running.
let options = {
  options: {
    debug: true
  },
  connection: {
    cluster: "aws",
    reconnect: true
  },
  // Store Username/Password in .env file to keep out of source code
  identity: {
    username: process.env.USERNAME2,
    password: process.env.PASSWORD
  },
    channels: [ channelName ]
};
console.log(options.identity.username);
console.log(options.identity.password);
// Set up our new TMI client and connect to the server.
let client =  new tmi.client(options);
client.connect();

// We have debug enabled now but if not we want some sort of confirmation
// we've connected to the server.
client.on('connected', (address, port) => {
  console.log(`Connected to ${address}:${port}`);
})

console.log('Bot connected to twitch');

// This simple bot will simply monitor chat logging for instances of '!twitter' or '!github'.
// 
client.on('chat', async (channel, viewer, message, self) => {
  try {
    const splitMessage = message.split(' ');
    const firstWord = splitMessage[0];

    // Global hello command
    if (firstWord === helloCommand) {
      client.action(channelName, 'Hello to you, too!');
      return;
    }

    // Get viewer and sync them with their row in google sheet
    const viewerDisplayName = viewer['display-name'];
    let viewers = await getViewers();
    let excelViewer = viewers.find(x => x.name.toLowerCase() == viewerDisplayName.toLowerCase());
    
    // User doesn't exist tell them to call create command
    // This can get spammy for any random messages so best not 
    // to reply in this instance.
    if (!excelViewer && message !== createCommand) {
      return;
    } 

    // Admin commands, fall through if not found
    if (viewerDisplayName.toLowerCase() === channelName.toLowerCase()) {
      switch(firstWord) {
        case testAdmingCommand:
          client.action(channelName, 'Test Successful!');
          break;
        case viewerCommand:
          const viewerNames = viewers.map(o => o.name);
          client.action(channelName, `All Viewers: ${viewerNames.join(',')}`);
          break;
        case addPointsCommand:
          const pointsToAdd = splitMessage[1];
          excelViewer.pointsToAdd(pointsToAdd);
          updateViewerRow(excelViewer);
          client.action(channelName, `${excelViewer.name} now has ${excelViewer.points}`);
          break;
      }
    }
    
    // General Commands
    switch(firstWord) {
      // List all general commands for viewer
      case commandsCommand:
        client.action(channelName, 'All viewer commands:');
        client.action(channelName, `${createCommand} - Create an entry for you in stream google sheet`);
        client.action(channelName, `${infoCommand} - List all stream google sheet info for you`);
        break;

      // Create an entry in the google sheet for the viewer
      case createCommand:
        if (!excelViewer) {
          let viewerIndex = viewers.length + 2; // Make up for base-1 and column header row
          let newViewer = new chatViewer.Viewer(data, viewerIndex, viewerDisplayName, true);
          updateViewerRow(newViewer);
          client.action(channelName, `Account created for: ${viewerDisplayName}`);
        } else {
          client.action(channelName, `${viewerDisplayName}, you already have an account.`);
        }
        break;

      // Display viewers data in google sheet
      case infoCommand:
        if (excelViewer) {
          client.action(channelName, excelViewer.toString());
        } else {
          client.action(channelName, `No user exists for ${viewerDisplayName}`);
        }
        break;
    }
  } catch (error) {
    console.log(error.message, error.stack);
  }
})

async function updateViewerRow(excelViewer) {
  try {
    let range = `${sheetName}!${VIEWERNAME_COLUMN}${excelViewer.rowNumber}`;
    let values = excelViewer.toRow();
    let valuesInDoubleArray = [];
    valuesInDoubleArray.push(values);

    const auth = await googleSheetUtilities.getAuthToken();
    const response = await googleSheetUtilities.updateSpreadSheetValues({
      spreadsheetId,
      auth,
      range: range,
      arrayValues: valuesInDoubleArray
    });
    
    console.log('output for updateSpreadSheetValues', JSON.stringify(response.data, null, 2));
  } catch(error) {
    console.log(error.message, error.stack);
  }
}

async function getViewers() {
  try {
    const auth = await googleSheetUtilities.getAuthToken();
    const response = await googleSheetUtilities.getSpreadSheetValues({
      spreadsheetId,
      sheetName,
      auth
    })

    let viewers = [];
    for (let i = 1; i < response.data.values.length; i++) {
      let viewer = new chatViewer.Viewer(response.data.values[i], i + 1);
      viewers.push(viewer);
      console.log('Viewer: ' + viewer.name);
    }
    
    return viewers;
  } catch(error) {
    console.log(error.message, error.stack);
  }
}