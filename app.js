const wa = require('@open-wa/wa-automate');
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

var parseJson;
var flag = 0;
var result = "";
var num = 0;
var j = 0;
var i = 0;
var numbers = "0123456789";
var currency, serviceFee, amount;

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = 'token.json';

//https://docs.google.com/spreadsheets/d/1EfP3yrPzsdQHfGR_mqMMZrqbCjmOIlBastaPwO1Koe8/edit#gid=0

wa.create({
    sessionId: "store",
    authTimeout: 60, //wait only 60 seconds to get a connection with the host account device
    blockCrashLogs: true,
    disableSpins: true,
    headless: true,
    multiDevice: true,
    hostNotificationLang: 'PT_BR',
    logConsole: false,
    popup: true,
    qrTimeout: 0, //0 means it will wait forever for you to scan the qr code
}).then(client => start(client));

function start(client) {
    client.onMessage(async message => {
        flag = 0;
        result = "";
        
        fs.readFile('file.json', function (err, content) {
            if (err) throw err;
            parseJson = JSON.parse(content);
            for (var i in parseJson.users) {
                
                if (parseJson.users[i].number === message.from) {
                    flag = 1;
                    if (parseJson.users[i].order === "1") {
                        parseJson.users[i].order = "2";
                        client.sendText(message.from, "Hi, Welcome to PAYIZI, your remote payments partner. What can we do on your behalf today? \n1. Send Payment \n2. Receive Payment \n3. Bill Payment \n4. Speak to consultant");
                    }
                    else if (parseJson.users[i].order === "2") {
                        if (message.body === "1") {
                            parseJson.users[i].order = "3";
                            client.sendText(message.from, "Please select the payout country: \n\n1. Zimbabwe \n2. South Africa \n3. UK");
                        }
                        else if (message.body === "2") {
                            parseJson.users[i].order = "4";
                            client.sendText(message.from, "Send payment reference number");
                        }
                        else if (message.body === "3") {
                            parseJson.users[i].order = "5";
                            client.sendText(message.from, "Select Package \n1. DSTV Access \n2. DSTV Compact \n3. DSTV Compact Plus \n4. DSTV Premium");
                        }
                        else if (message.body === "4") {
                            parseJson.users[i].order = "6";
                            client.sendText(message.from, "Enter amount");
                        }
                        else if (message.body === "5") {
                            client.sendText(message.from, "A consultant will be in touch shortly");
                            parseJson.users[i].order = "1";
                        }
                        else {
                            parseJson.users[i].order = "2";
                            client.sendText(message.from, "Wrong response, reply with a number between 1 and 5");
                        }
                    }
                    else if (parseJson.users[i].order === "3") {
                        if (message.body === "1") {
                            parseJson.users[i].order = "9";
                            parseJson.users[i].exchange = "USD";
                            client.sendText(message.from, "Enter the USD amount you want your recipient to receive. \nMinimum amount USD10");
                        }
                        else if (message.body === "2") {
                            parseJson.users[i].order = "9";
                            parseJson.users[i].exchange = "ZAR";
                            client.sendText(message.from, "Enter the ZAR amount you want your recipient to receive. \nMinimum amount ZAR100");
                        }
                        else if (message.body === "3") {
                            parseJson.users[i].order = "9";
                            parseJson.users[i].exchange = "GBP";
                            client.sendText(message.from, "Enter the GBP amount you want your recipient to receive. \nMinimum amount GBP10");
                        }
                        else {
                            parseJson.users[i].order = "3";
                            client.sendText(message.from, "Wrong response, reply with a number between 1 and 3");
                        }
                        /*for (let i = 0; i < message.body.length; i++) {
                            for (let j = 0; j < 10; j++) {
                                if (message.body.charAt(i) === numbers.charAt(j)) {
                                    result = result.concat(numbers.charAt(j));
                                }
                            }
                        }
                        client.sendText(message.from, "Click the link below to make the transfer \n\n".concat("https://lavender-long-cerise.glitch.me/?product=", result, "\nReply with your phone number/email address so that we can track your payment"));*/
                        
                    }
                    else if (parseJson.users[i].order === "4") {
                        client.sendText(message.from, "Thank you, a consultant will be in touch shortly");
                        parseJson.users[i].order = "1";
                    }
                    else if (parseJson.users[i].order === "5") {
                        if (message.body === "1") {
                            client.sendText(message.from, "Click the link below to make the transfer \n\n".concat("https://lavender-long-cerise.glitch.me/?product=215", "\nReply with your phone number/email address so that we can track your payment"));
                            parseJson.users[i].order = "7";
                        }
                        else if (message.body === "2") {
                            client.sendText(message.from, "Click the link below to make the transfer \n\n".concat("https://lavender-long-cerise.glitch.me/?product=440", "\nReply with your phone number/email address so that we can track your payment"));
                            parseJson.users[i].order = "7";
                        }
                        else if (message.body === "3") {
                            client.sendText(message.from, "Click the link below to make the transfer \n\n".concat("https://lavender-long-cerise.glitch.me/?product=545", "\nReply with your phone number/email address so that we can track your payment"));
                            parseJson.users[i].order = "7";
                        }
                        else if (message.body === "4") {
                            client.sendText(message.from, "Click the link below to make the transfer \n\n".concat("https://lavender-long-cerise.glitch.me/?product=720", "\nReply with your phone number/email address so that we can track your payment"));
                            parseJson.users[i].order = "7";
                        }
                        else {
                            client.sendText(message.from, "Invalid response, please reply with a number between 1 and 4");
                            parseJson.users[i].order = "5";
                        }
                        
                    }
                    else if (parseJson.users[i].order === "6") {
                        for (let i = 0; i < message.body.length; i++) {
                            for (let j = 0; j < 10; j++) {
                                if (message.body.charAt(i) === numbers.charAt(j)) {
                                    result = result.concat(numbers.charAt(j));
                                }
                            }
                        }
                        client.sendText(message.from, "Click the link below to make the transfer \n\n".concat("https://lavender-long-cerise.glitch.me/?product=", result, "\nReply with your phone number/email address so that we can track your payment"));
                        parseJson.users[i].order = "7";
                    }
                    else if (parseJson.users[i].order === "7") {
                        client.sendText(message.from, "Enter the receipient's ID number");
                        //client.sendText(message.from, "Click the link below to make the transfer \n\n".concat("https://lavender-long-cerise.glitch.me/?product=", parseJson.users[i].payment, "\nReply with your phone number/email address so that we can track your payment"));
                        parseJson.users[i].name = message.body;
                        parseJson.users[i].order = "10";
                        
                    }
                    else if (parseJson.users[i].order === "8") {
                        if (message.body === "1") {
                            parseJson.users[i].order = "7";
                            client.sendText(message.from, "Please enter the receipient's full name");
                        }
                        else if (message.body === "2") {
                            if (parseJson.users[i].exchange === "USD") {
                                parseJson.users[i].order = "9";
                                client.sendText(message.from, "Enter the USD amount you want your recipient to receive. \nMinimum amount $10");
                            }
                            else if (parseJson.users[i].exchange === "ZAR") {
                                parseJson.users[i].order = "9";
                                client.sendText(message.from, "Enter the ZAR amount you want your recipient to receive. \nMinimum amount R100");
                            }
                            else if (parseJson.users[i].exchange === "GBP") {
                                parseJson.users[i].order = "9";
                                client.sendText(message.from, "Enter the GBP amount you want your recipient to receive. \nMinimum amount GBP10");
                            }
                        }
                        else if (message.body === "3") {
                            client.sendText(message.from, "Transfer cancelled, hope to hear from you soon");
                            parseJson.users[i].order = "1";
                        }
                        else {
                            client.sendText(message.from, "Invalid response, please reply with a number between 1 and 3");
                            parseJson.users[i].order = "7";
                        }
                        //client.sendText(message.from, "Your payment reference ID is 345673, please send it to the person who will be making a withdrawal and make sure they come with an ID for the withdrawal to be approved \n\nFor queries or any issues please send a Hi");
                        
                    }
                    else if (parseJson.users[i].order === "9") {
                        if (parseJson.users[i].exchange === "USD") {
                            for (let i = 0; i < message.body.length; i++) {
                                for (let j = 0; j < 10; j++) {
                                    if (message.body.charAt(i) === numbers.charAt(j)) {
                                        result = result.concat(numbers.charAt(j));
                                    }
                                }
                            }
                            serviceFee = (parseFloat(result) * 0.05).toString();
                            if(message.from.charAt(1) === "7"){
                                currency = "R";
                                num = (parseFloat(result) + (parseFloat(result) * 0.05)) * 18  ;
                            }
                            else if(message.from.charAt(1) === "4"){
                                currency = "£";
                                num = 0.85 *(parseFloat(result) + (parseFloat(result) * 0.05));
                            }
                            else{
                                currency = "$";
                                num = parseFloat(result) + (parseFloat(result) * 0.05);
                            }
                            
                            amount = num.toString();

                            client.sendText(message.from, "Send amount: ".concat("$ ",result , "\nService charge: 5% - ($",serviceFee,")" , "\nTotal: $", (parseFloat(result) + parseFloat(serviceFee)).toString(), " \nYou pay: ",currency, amount, "\n1. Accept \n2. Change amount \n3. No"));
                            //client.sendText(message.from, "Click the link below to make the transfer \n\n".concat("https://lavender-long-cerise.glitch.me/?product=", result, "\nReply with your phone number/email address so that we can track your payment"));
                            parseJson.users[i].order = "8";
                            parseJson.users[i].payment = result;
                        }
                        else if (parseJson.users[i].exchange === "ZAR") {
                            for (let i = 0; i < message.body.length; i++) {
                                for (let j = 0; j < 10; j++) {
                                    if (message.body.charAt(i) === numbers.charAt(j)) {
                                        result = result.concat(numbers.charAt(j));
                                    }
                                }
                            }
                            serviceFee = parseFloat(result) * 0.05;
                            if(message.from.charAt(1) === "7"){
                                currency = "R";
                                num = (parseFloat(result) + (parseFloat(result) * 0.05));
                            }
                            else if(message.from.charAt(1) === "4"){
                                currency = "£";
                                num = 0.049 * (parseFloat(result) + (parseFloat(result) * 0.05));
                            }
                            else{
                                currency = "$";
                                num = 0.058 * (parseFloat(result) + (parseFloat(result) * 0.05));
                            }
                            amount = num.toString();
                            client.sendText(message.from, "Send amount: ".concat("R ",result , "\nService charge: 5% - (R",serviceFee,")" , "\nTotal: R", (parseFloat(result) + parseFloat(serviceFee)).toString(), " \nYou pay: ",currency, amount, "\n1. Accept \n2. Change amount \n3. No"));
                            //client.sendText(message.from, "Click the link below to make the transfer \n\n".concat("https://lavender-long-cerise.glitch.me/?product=", result, "\nReply with your phone number/email address so that we can track your payment"));
                            parseJson.users[i].order = "8";
                            parseJson.users[i].payment = result;
                        }
                        else if (parseJson.users[i].exchange === "GBP") {
                            for (let i = 0; i < message.body.length; i++) {
                                for (let j = 0; j < 10; j++) {
                                    if (message.body.charAt(i) === numbers.charAt(j)) {
                                        result = result.concat(numbers.charAt(j));
                                    }
                                }
                            }
                            serviceFee = parseFloat(result) * 0.05;
                            if(message.from.charAt(1) === "7"){
                                currency = "R";
                                num = (parseFloat(result) + (parseFloat(result) * 0.05)) * 20  ;
                            }
                            else if(message.from.charAt(1) === "4"){
                                currency = "£";
                                num = parseFloat(result) + (parseFloat(result) * 0.05);
                            }
                            else{
                                currency = "$";
                                num = 1.18 * (parseFloat(result) + (parseFloat(result) * 0.05));
                            }
                            
                            amount = num.toString();
                            client.sendText(message.from, "Send amount: ".concat("£ ",result , "\nService charge: 5% - (£",serviceFee,")" , "\nTotal: £", (parseFloat(result) + parseFloat(serviceFee)).toString(), " \nYou pay: ",currency, amount, "\n1. Accept \n2. Change amount \n3. No"));
                            //client.sendText(message.from, "Click the link below to make the transfer \n\n".concat("https://lavender-long-cerise.glitch.me/?product=", result, "\nReply with your phone number/email address so that we can track your payment"));
                            parseJson.users[i].order = "8";
                            parseJson.users[i].payment = result;
                        }
                    }
                    else if (parseJson.users[i].order === "10") {
                        //client.sendText(message.from, "Click the link below to make the transfer \n\n".concat("https://lavender-long-cerise.glitch.me/?product=", parseJson.users[i].payment, "\nReply with your phone number/email address so that we can track your payment"));
                        client.sendText(message.from, "Enter the receipient's phone number");
                        parseJson.users[i].order = "11";
                        parseJson.users[i].idnumber = message.body;
                    }
                    else if (parseJson.users[i].order === "11") {
                        client.sendText(message.from, "Select Payment Method \n\n1. Cash Collection \n2. Bank Transfer");
                        parseJson.users[i].order = "12";
                        parseJson.users[i].phone = message.body;
                    }
                    else if (parseJson.users[i].order === "12") {
                        if (message.body === "1") {
                            //parseJson.users[i].order = "14";
                            if (parseJson.users[i].exchange === "USD") {
                                parseJson.users[i].order = "14";
                                client.sendText(message.from, "Select Region \n\n1. Harare - Livingstone \n2. Zhombe - Joel");
                            }
                            else if (parseJson.users[i].exchange === "ZAR") {
                                parseJson.users[i].order = "14";
                                client.sendText(message.from, "Select Region \n\n1. Johannesburg \n2. Durban");
                            }
                            else if (parseJson.users[i].exchange === "GBP") {
                                parseJson.users[i].order = "14";
                                client.sendText(message.from, "Select Region \n\n1. London \n2. Manchester");
                            }
                        }
                        else if (message.body === "2") {
                            parseJson.users[i].order = "13";
                            client.sendText(message.from, "Please enter receipient's account details");
                        }
                        else {
                            client.sendText(message.from, "Invalid response, please reply with a number between 1 and 3");
                            parseJson.users[i].order = "12";
                        }
                    }
                    else if (parseJson.users[i].order === "13") {
                        client.sendText(message.from, "Paziyi payment order PZW?3887479939 submitted successfully. \nPlease make an instant EFT or Cash deposit to the following bank account. \nEnter your order number as transaction reference. \nFNB AVST SA \n62858977063 \nReply with a Proof of Payment");
                        parseJson.users[i].order = "15";
                        parseJson.users[i].account = message.body;
                    }
                    else if (parseJson.users[i].order === "14") {
                        if (parseJson.users[i].exchange === "USD") {
                            if (message.body === "1") {
                                client.sendText(message.from, "Paziyi payment order PZW?3887479939 submitted successfully. \nPlease make an instant EFT or Cash deposit to the following bank account. \nEnter your order number as transaction reference. \nFNB AVST SA \n62858977063 \nReply with a Proof of Payment");
                                parseJson.users[i].order = "15";
                                parseJson.users[i].region = "Harare";
                            }
                            else if (message.body === "2") {
                                client.sendText(message.from, "Paziyi payment order PZW?3887479939 submitted successfully. \nPlease make an instant EFT or Cash deposit to the following bank account. \nEnter your order number as transaction reference. \nFNB AVST SA \n62858977063 \nReply with a Proof of Payment");
                                parseJson.users[i].order = "15";
                                parseJson.users[i].region = "Zhombe";
                            }
                            else {
                                client.sendText(message.from, "Invalid response, please reply with a number between 1 and 2");
                                parseJson.users[i].order = "14";
                            }

                        }
                        else if (parseJson.users[i].exchange === "ZAR") {
                            if (message.body === "1") {
                                client.sendText(message.from, "Paziyi payment order PZW?3887479939 submitted successfully. \nPlease make an instant EFT or Cash deposit to the following bank account. \nEnter your order number as transaction reference. \nFNB AVST SA \n62858977063 \nReply with a Proof of Payment");
                                parseJson.users[i].order = "15";
                                parseJson.users[i].region = "Johannesburg";
                            }
                            else if (message.body === "2") {
                                client.sendText(message.from, "Paziyi payment order PZW?3887479939 submitted successfully. \nPlease make an instant EFT or Cash deposit to the following bank account. \nEnter your order number as transaction reference. \nFNB AVST SA \n62858977063 \nReply with a Proof of Payment");
                                parseJson.users[i].order = "15";
                                parseJson.users[i].region = "Durban";
                            }
                            else {
                                client.sendText(message.from, "Invalid response, please reply with a number between 1 and 2");
                                parseJson.users[i].order = "14";
                            }
                        }
                        else if (parseJson.users[i].exchange === "GBP") {
                            if (message.body === "1") {
                                client.sendText(message.from, "Paziyi payment order PZW?3887479939 submitted successfully. \nPlease make an instant EFT or Cash deposit to the following bank account. \nEnter your order number as transaction reference. \nFNB AVST SA \n62858977063 \nReply with a Proof of Payment");
                                parseJson.users[i].order = "15";
                                parseJson.users[i].region = "London";
                            }
                            else if (message.body === "2") {
                                client.sendText(message.from, "Paziyi payment order PZW?3887479939 submitted successfully. \nPlease make an instant EFT or Cash deposit to the following bank account. \nEnter your order number as transaction reference. \nFNB AVST SA \n62858977063 \nReply with a Proof of Payment");
                                parseJson.users[i].order = "15";
                                parseJson.users[i].region = "Manchester";
                            }
                            else {
                                client.sendText(message.from, "Invalid response, please reply with a number between 1 and 2");
                                parseJson.users[i].order = "14";
                            }
                        }
                    }
                    else if (parseJson.users[i].order === "15") {
                        client.sendText(message.from, "Thank you for making the transfer, a consultant will be in touch shortly with you and the receipient");
                        parseJson.users[i].order = "1";
                        j = i;
                        fs.readFile('credentials.json', (err, content) => {
                            if (err) return console.log('Error loading client secret file:', err);
                            // Authorize a client with credentials, then call the Google Sheets API.
                            authorize(JSON.parse(content), listMajors);
                        });
                    }
                    fs.writeFile('file.json', JSON.stringify(parseJson), function (err) {
                        if (err) throw err;
                        console.log("done");
                    });
                }
            }
            if (flag === 0) {
                parseJson.users.push({ number: message.from, phone:"0", order: "2", region:"0", payment:"0", reference:"0", exchange:"0",name:"0", account:"0", idnumber:"0"});
                client.sendText(message.from, "Hi, Welcome to PAYIZI. The best in local and international money transfers. How can we help you \n1. Send Money \n2. Withdraw to account \n3. Pay for DSTV \n4. Pay for Avon \n5. Speak to consultant")
                fs.writeFile('file.json', JSON.stringify(parseJson), function (err) {
                    if (err) throw err;
                    console.log("done");
                });
            }
        });
    });
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
 function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1Z5hkgKDF78tGBsPIAMwr2TLKH6__ohAeXTmU8iWQREk/edit#gid=0
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function listMajors(auth) {
    const sheets = google.sheets({ version: 'v4', auth });

    let values = [
        [
            parseJson.users[j].number, parseJson.users[j].name,parseJson.users[j].idnumber,parseJson.users[j].phone,parseJson.users[j].account,parseJson.users[j].payment,parseJson.users[j].region, new Date().toISOString()
        ]
    ];
    let resource = {
        values: values,
    };
    sheets.spreadsheets.values.append({
        spreadsheetId: '1EfP3yrPzsdQHfGR_mqMMZrqbCjmOIlBastaPwO1Koe8',
        range: 'Sheet1!A2:G',
        valueInputOption: 'RAW',
        resource: resource,
    }, (err, result) => {
        if (err) {
            // Handle error.
            console.log(err);
        } else {
            console.log(`cells appended.`);
        }
    });
}
