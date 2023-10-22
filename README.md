# Twitch Bot w/ Google Sheet Integration

A bare bones example on how to add a Twitch bot to your Twitch chat using tmi.js and Glitch.

## Getting Started
### Install Node.JS and NPM Node Modules
- [Download Node.JS](https://nodejs.org/en/download)
  - You can skip this if you already have it installed
- Navigate to code folder with command line
- Run `npm i`

### Create Twitch account for your chat bot
- Log out (or use different browser) if you're already signed in with your twitch account
- Create a new account for your bot to use.
- Visit [Twitch Apps TMI](https://twitchapps.com/tmi/) to generate your OAuth token
- Edit .env file add the USERNAME and oauth PASSWORD for your bot.
  - I think this has changed since I implemented this and you may need to use a token value instead
- Try running the bot using the steps below to debug until you get this working

### Create and link your Google Sheet
- Follow the steps here to generate your google sheet api credentials: [Generate Service Account Creds](https://medium.com/@a.marenkov/how-to-get-credentials-for-google-sheets-456b7e88c430)
  - You can copy those creds right into `service_account_creds_.json`
- Update `project_id` in .env file - [How to find your google sheet project id](https://support.google.com/googleapi/answer/7014113?hl=en)
- Update `SPREADSHEETID` in .env file:
  - "The Spreadsheet ID is the last string of characters in the URL for your spreadsheet. For example, in the URL https://docs.google.com/spreadsheets/d/1qpyC0XzvTcKT6EISywvqESX3A0MwQoFDE8p-Bll4hps/edit#gid=0 , the spreadsheet ID is 1qpyC0XzvTcKT6EISywvqESX3A0MwQoFDE8p-Bll4hps."
- Configure [project Oauth consent screen](https://console.cloud.google.com/apis/credentials/consent)
  - Make sure to specify `glitch.com` as an authorized domain (for express I think)

### Alternative
- Follow steps in [this document](https://ei.docs.wso2.com/en/latest/micro-integrator/references/connectors/google-spreadsheet-connector/get-credentials-for-google-spreadsheet/#:~:text=Under%20Step%201%2C%20select%20Google,Access%20Token%20and%20Refresh%20Token.)

### Configure The App
- I have some basic commands implemented to get you started but you can replace most of them.
- Update the twitch channel id variable in constants.js, this is the channel you want the bot to join.

## Running The Bot
- Navigate to code folder with command line
- Run `npm start`
  - This will compile the app and run it. You should see some updates in the command line.
- Via your streams chat you can type `!hello` to see a response from your bot. You can remove this later - it's just a sample command.

## Sources
- [Shindakun](https://github.com/shindakun/twitch-bot) for Twitch API implementation (I've left a lot of Shindakun's original messages in to support them)
- [Google Sheet API Documentation](https://developers.google.com/sheets/api/guides/concepts) for understanding how to send requests to Google Sheets
- [google-sheets-api](https://www.npmjs.com/package/google-sheets-api) - the npm package we're using
