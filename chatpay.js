const wa = require('@open-wa/wa-automate');
const fs = require('fs');
var parseJson;
var sum = 0;
var flag = 0;

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
        sum = 0;
        out = "";
        fs.readFile('file.json', function (err, content) {
            if (err) throw err;
            parseJson = JSON.parse(content);
            for (var i in parseJson.users) {
                if (parseJson.users[i].number === message.from) {
                    flag = 1;
                    if (parseJson.users[i].order === "1") {
                        parseJson.users[i].order = "2";
                        client.sendText(message.from, "Hi welcome to the Chat Pay, please with the number that matches your request: \n\n1. Place Order \n2. Track my order \n3. Talk to consultant");
                    }
                    else if (parseJson.users[i].order === "2") {
                        if (message.body === "1") {
                            /*if (parseJson.users[i].menu === "0") {
                                client.sendText(message.from, "Items: \nBread R15 \nMilk R22 \nEggs R30 \nRice R85 \nMaize Meal R85 \nCooking Oil R55 \nFlour R85");
                                parseJson.users[i].menu = "1";
                            }*/
                            parseJson.users[i].order = "3";
                            client.sendText(message.from, "Please select one these stores: \n\n1. TSE TakeAways \n2. Sabelo Restaurant \n3. Terrence Foods");
                        }
                        else if (message.body === "2") {
                            // have a status flag that can be used to check order status
                            parseJson.users[i].order = "1";
                            client.sendText(message.from, "Your order is on its way");
                            //client.sendText(message.from, "1. Place Order \n2. Home");

                        }
                        else if (message.body === "3") {
                            parseJson.users[i].order = "1";
                            client.sendText(message.from, "A consultant will be in touch shortly");
                        }
                        else {
                            parseJson.users[i].order = "1";
                            client.sendText(message.from, "Invalid response, reply with a number between 1 and 3");
                        }
                    }
                    else if (parseJson.users[i].order === "3") {
                        if (message.body === "1") {
                            client.sendText(message.from, "TSE Takeaways, what would you like to order: \n\n1. Fried Chips(small) - R10 \n2. Fried Chips(medium) - R15 \n3. Fried Chips(large) - R20 \n4. Russian Roll and Fries - R30 \n5. Chicken Wings - R25");
                            parseJson.users[i].shop = "TSE Takeaways";
                            parseJson.users[i].order = "5";
                        }
                        else if (message.body === "2") {
                            client.sendText(message.from, "Sabelo Restaurant, what would you like to order: \n\n1. Inyama yenhloko(medium)  - R35 \n2. Inyama yenhloko(large) - R55 \n3. Umgxabhiso(medium) - R30 \n4. Umgxabhiso(large) - R45 \n5. Beef and Rice - R35");
                            parseJson.users[i].shop = "Sabelo Restaurant";
                            parseJson.users[i].order = "5";
                        }
                        else if (message.body === "3") {
                            client.sendText(message.from, "Terrence Foods, what would you like to order: \n\n1. Meat Platter - R105 \n2. Grilled 1/4 Chicken - R30 \n3. Full Grilled Chicken - R95 \n4. Beef Burger and Chips - R70 \n5. Chicken Burger and Chips - R65");
                            parseJson.users[i].shop = "Terrence Foods";
                            parseJson.users[i].order = "5";
                        }
                        else {
                            client.sendText(message.from, "Invalid response, reply with a number between 1 and 3");
                        }
                    }
                    else if (parseJson.users[i].order === "5") {
                        if (parseJson.users[i].shop === "TSE Takeaways") {
                            if (message.body === "1") {
                                parseJson.users[i].price = (parseInt(parseJson.users[i].price) + 10).toString();
                                client.sendText(message.from, "Item has been added to cart \nTotal Cost: ".concat('R', parseJson.users[i].price, "\n\n1. Add another item \n2. Checkout \n3. Cancel Order"));
                                parseJson.users[i].order = "6";
                            }
                            else if (message.body === "2") {
                                parseJson.users[i].price = (parseInt(parseJson.users[i].price) + 15).toString();
                                client.sendText(message.from, "Item has been added to cart \nTotal Cost: ".concat('R', parseJson.users[i].price, "\n\n1. Add another item \n2. Checkout \n3. Cancel Order"));
                                parseJson.users[i].order = "6";
                            }
                            else if (message.body === "3") {
                                parseJson.users[i].price = (parseInt(parseJson.users[i].price) + 20).toString();
                                client.sendText(message.from, "Item has been added to cart \nTotal Cost: ".concat('R', parseJson.users[i].price, "\n\n1. Add another item \n2. Checkout \n3. Cancel Order"));
                                parseJson.users[i].order = "6";
                            }
                            else if (message.body === "4") {
                                parseJson.users[i].price = (parseInt(parseJson.users[i].price) + 30).toString();
                                client.sendText(message.from, "Item has been added to cart \nTotal Cost: ".concat('R', parseJson.users[i].price, "\n\n1. Add another item \n2. Checkout \n3. Cancel Order"));
                                parseJson.users[i].order = "6";
                            }
                            else if (message.body === "5") {
                                parseJson.users[i].price = (parseInt(parseJson.users[i].price) + 25).toString();
                                client.sendText(message.from, "Item has been added to cart \nTotal Cost: ".concat('R', parseJson.users[i].price, "\n\n1. Add another item \n2. Checkout \n3. Cancel Order"));
                                parseJson.users[i].order = "6";
                            }
                            else {
                                client.sendText(message.from, "Invalid response, reply with a number between 1 and 5");
                            }
                        }
                        else if (parseJson.users[i].shop === "Sabelo Restaurant") {
                            if (message.body === "1") {
                                parseJson.users[i].price = (parseInt(parseJson.users[i].price) + 35).toString();
                                client.sendText(message.from, "Item has been added to cart \nTotal Cost: ".concat('R', parseJson.users[i].price, "\n\n1. Add another item \n2. Checkout \n3. Cancel Order"));
                                parseJson.users[i].order = "6";
                            }
                            else if (message.body === "2") {
                                //client.sendText(message.from, "Sabelo Restaurant, what would you like to order: \n\n1. Inyama yenhloko(medium)  - R35 \n2. Inyama yenhloko(large) - R55 \n3. Umgxabhiso(medium) - R30 \n4. Umgxabhiso(large) - R45 \n5. Beef and Rice - R35");
                                parseJson.users[i].price = (parseInt(parseJson.users[i].price) + 55).toString();
                                client.sendText(message.from, "Item has been added to cart \nTotal Cost: ".concat('R', parseJson.users[i].price, "\n\n1. Add another item \n2. Checkout \n3. Cancel Order"));
                                parseJson.users[i].order = "6";
                            }
                            else if (message.body === "3") {
                                parseJson.users[i].price = (parseInt(parseJson.users[i].price) + 30).toString();
                                client.sendText(message.from, "Item has been added to cart \nTotal Cost: ".concat('R', parseJson.users[i].price, "\n\n1. Add another item \n2. Checkout \n3. Cancel Order"));
                                parseJson.users[i].order = "6";
                            }
                            else if (message.body === "4") {
                                parseJson.users[i].price = (parseInt(parseJson.users[i].price) + 45).toString();
                                client.sendText(message.from, "Item has been added to cart \nTotal Cost: ".concat('R', parseJson.users[i].price, "\n\n1. Add another item \n2. Checkout \n3. Cancel Order"));
                                parseJson.users[i].order = "6";
                            }
                            else if (message.body === "5") {
                                parseJson.users[i].price = (parseInt(parseJson.users[i].price) + 35).toString();
                                client.sendText(message.from, "Item has been added to cart \nTotal Cost: ".concat('R', parseJson.users[i].price, "\n\n1. Add another item \n2. Checkout \n3. Cancel Order"));
                                parseJson.users[i].order = "6";
                            }
                            else {
                                client.sendText(message.from, "Invalid response, reply with a number between 1 and 5");
                            }
                        }
                        else if (parseJson.users[i].shop === "Terrence Foods") {
                            if (message.body === "1") {
                                parseJson.users[i].price = (parseInt(parseJson.users[i].price) + 105).toString();
                                client.sendText(message.from, "Item has been added to cart \nTotal Cost: ".concat('R', parseJson.users[i].price, "\n\n1. Add another item \n2. Checkout \n3. Cancel Order"));
                                parseJson.users[i].order = "6";
                            }
                            else if (message.body === "2") {
                                parseJson.users[i].price = (parseInt(parseJson.users[i].price) + 95).toString();
                                client.sendText(message.from, "Item has been added to cart \nTotal Cost: ".concat('R', parseJson.users[i].price, "\n\n1. Add another item \n2. Checkout \n3. Cancel Order"));
                                parseJson.users[i].order = "6";
                            }
                            else if (message.body === "3") {
                                //client.sendText(message.from, "Terrence Foods, what would you like to order: \n\n1. Meat Platter - R105 \n2. Grilled 1/4 Chicken - R30 \n3. Full Grilled Chicken - R95 \n4. Beef Burger and Chips - R70 \n5. Chicken Burger and Chips - R65");
                                parseJson.users[i].price = (parseInt(parseJson.users[i].price) + 30).toString();
                                client.sendText(message.from, "Item has been added to cart \nTotal Cost: ".concat('R', parseJson.users[i].price, "\n\n1. Add another item \n2. Checkout \n3. Cancel Order"));
                                parseJson.users[i].order = "6";
                            }
                            else if (message.body === "4") {
                                parseJson.users[i].price = (parseInt(parseJson.users[i].price) + 70).toString();
                                client.sendText(message.from, "Item has been added to cart \nTotal Cost: ".concat('R', parseJson.users[i].price, "\n\n1.Add another item \n2. Checkout \n3. Cancel Order"));
                                parseJson.users[i].order = "6";
                            }
                            else if (message.body === "5") {
                                parseJson.users[i].price = (parseInt(parseJson.users[i].price) + 65).toString();
                                client.sendText(message.from, "Item has been added to cart \nTotal Cost: ".concat('R', parseJson.users[i].price, "\n\n1. Add another item \n2. Checkout \n3. Cancel Order"));
                                parseJson.users[i].order = "6";
                            }
                            else {
                                client.sendText(message.from, "Invalid response, reply with a number between 1 and 5");
                            }
                        }
                    }
                    else if (parseJson.users[i].order === "6") {
                        if (message.body === "1") {
                            parseJson.users[i].order = "3";
                            client.sendText(message.from, "Please select one these stores: \n\n1. TSE TakeAways \n2. Sabelo Restaurant \n3. Terrence Foods");
                        }
                        else if (message.body === "2") {
                            parseJson.users[i].order = "7";
                            client.sendText(message.from, "Total Cost: ".concat('R', parseJson.users[i].price, "\n\n", "Payment method \n1. Cash \n2. Eft \n3. Speed Pointer"));

                        }
                        else if (message.body === "3") {
                            parseJson.users[i].order = "1";
                            client.sendText(message.from, "Your pending order has been cancelled, we hope to hear from you soon");
                        }
                        else {
                            client.sendText(message.from, "Invalid response, reply with a number between 1 and 3");
                        }
                    }
                    /*else if (parseJson.users[i].order === "7") {
                        arr.forEach(element => {
                            if (message.body.toLowerCase().includes(element)) {
                                sum = sum + prices[arr.indexOf(element)];
                            }
                        });
                        if (sum > 0) {
                            out = 'Total Cost: '.concat('R', sum.toString(), '\n\n', 'Payment method \n1. Cash \n2. Eft \n3. Speed Pointer');
                            client.sendText(message.from, "Total Cost: ".concat('R', parseJson.users[i].price, "\n\n", "Payment method \n1. Cash \n2. Eft \n3. Speed Pointer");
                            client.sendText(message.from, out);
                            parseJson.users[i].order = "5";
                            parseJson.users[i].amount = sum.toString();
                        }
                        else {
                            client.sendText(message.from, "We don't have the items you sent, please look at the menu and send in an order");
                            parseJson.users[i].order = "1";
                        }
                    }*/
                    else if (parseJson.users[i].order === "4") {
                        if (message.body === "1") {
                            client.sendText(message.from, "Please select one these stores: \n\n1. TSE TakeAways \n2. Sabelo Restaurant \n3. Terrence Foods");
                            parseJson.users[i].order = "3";
                        }
                        else if (message.body === "2") {
                            parseJson.users[i].order = "2";
                            client.sendText(message.from, "Hi welcome to the Chat Pay, please with the number that matches your request: \n\n1. Place Order \n2. Track my order \n3. Talk to consultant");
                        }
                        else {
                            client.sendText(message.from, "Invalid response, please reply with a number between 1 and 3");
                            parseJson.users[i].order = "4";
                        }
                    }
                    else if (parseJson.users[i].order === "7") {
                        if (message.body === "1") {
                            client.sendText(message.from, "Your order is being processed and will be delivered soon \n\nThank you for using Chat Pay");
                            parseJson.users[i].order = "1";
                            parseJson.users[i].price = "0";
                        }
                        else if (message.body === "2") {
                            client.sendText(message.from, "Payment link: \n\n".concat("https://lavender-long-cerise.glitch.me/?product=", parseJson.users[i].price, "\nReply with your phone number so that we can track your payment"));
                            parseJson.users[i].order = "8";
                        }
                        else if (message.body === "3") {
                            client.sendText(message.from, "Your order is being processed and will be delivered soon \nOur courier will bring a speed pointer \n\nThank you for using Chat Pay");
                            parseJson.users[i].order = "1";
                            parseJson.users[i].price = "0";
                        }
                        else {
                            client.sendText(message.from, "Invalid response, please reply with a number between 1 and 3");
                            parseJson.users[i].order = "7";
                        }
                    }
                    else if (parseJson.users[i].order === "8") {
                        client.sendText(message.from, "Your order is being processed and will be delivered soon \nOur courier will be in touch shortly \n\nThank you for using Chat Pay");
                        parseJson.users[i].order = "1";
                        parseJson.users[i].price = "0";
                    }
                    fs.writeFile('file.json', JSON.stringify(parseJson), function (err) {
                        if (err) throw err;
                        console.log("done");
                    });
                }
            }
            if (flag === 0) {
                parseJson.users.push({ number: message.from, order: "2", menu: "0", shop: "null", price: "0" });
                client.sendText(message.from, "Hi welcome to the Chat Pay, please with the number that matches your request: \n\n1. Place Order \n2. Track my order \n3. Talk to consultant");
                fs.writeFile('file.json', JSON.stringify(parseJson), function (err) {
                    if (err) throw err;
                    console.log("done");
                });
            }
        });
    });
}