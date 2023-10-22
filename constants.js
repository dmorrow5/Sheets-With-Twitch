// Constants for code readability accessing google sheet columns
// Be sure to keep in sync with actual google sheet
const START_COLUMN= 'A'; // Duplicate column descriptor for iterating
const VIEWERNAME_COLUMN = 'A';
const END_COLUMN = 'A'; // Duplicate column descriptor for iterating
const sheetName = 'sheet1';

// Stream Constants
const channelName = `the_dark_adonis`;
const helloCommand = '!hello';
const createCommand = '!create';
const testAdmingCommand = '!test';
const infoCommand = '!info';
const viewerCommand = '!all-viewers';
const addPointsCommand = '!add-points';
const commandsCommand = '!commands';

module.exports = {
    START_COLUMN,
    VIEWERNAME_COLUMN,
    END_COLUMN,
    sheetName,
    channelName,
    helloCommand,
    createCommand,
    testAdmingCommand,
    infoCommand,
    viewerCommand,
    addPointsCommand,
    commandsCommand
}