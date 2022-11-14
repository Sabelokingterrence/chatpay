const qrcode = require('qrcode-terminal');

const { Client, Buttons } = require('whatsapp-web.js');
const client = new Client();
let button = new Buttons('Button body',[{body:'bt1'},{body:'bt2'},{body:'bt3'}],'title','footer');
        

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', message => {
    client.sendMessage(msg.from, button);
	console.log(message.body);
});
 
client.initialize();
 