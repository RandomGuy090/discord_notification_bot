#! /usr/bin/node
const { Client, Intents } = require('discord.js');
const net = require('net');
const process = require('process');
const EventEmitter = require('events');

// statics
const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"] });
const myEmitter = new EventEmitter();
const controller = new AbortController();
const closeTimeout = 5000;


const JsonInvalidResponse = `{
  content; "<message here>"
}\n`

// variables

let PORT = 45454; 
let ADDRESS = "127.0.0.1"
let CHANNEL;
let message;
let TOKEN;
let CLOSE = false;
let OWNER = false;

// args parser

var myArgs = process.argv.slice(2);

for (var i = 0; i<myArgs.length; i++){
  switch(myArgs[i]){

    case "-p" || "--port":
      PORT = myArgs[i+1];
      break;

    case "-a" || "--address":
        ADDRESS = myArgs[i+1];
        break;
    
    case "-c" || "--channel":
        CHANNEL = myArgs[i+1];
        break;

    case "-m" || "--message":
        message = myArgs[i+1];
        break;

    case "-t" || "--token":
        TOKEN = myArgs[i+1];
        break;
    case "-o" || "--owner":
        OWNER = true;
        break;

    case "-h" || "--help":
        console.log(`./discord_notify.js 

  discord notification bot
  flags:
  -a  --address   socket server ip address
  -p  --port      socket server port
  -c  --channel   discord channel id (to send notification)
  -m  --message   message content
  -t  --token     discord bot token
  -h  --help      printout help message
  -o  --owner     send to server owner
        `);
      process.exit(0);
      break;
  }
}

// creating socket server
function initSocket(){
  console.log("socket init")
  if ( message == undefined){
    // creating socket server 
    var server = net.createServer(function(socket) {
      socket.on('data', function(data) {
        // data = JSON.parse(data)
        var msg;
        data = data.toString()        
        try{ 
          msg = JSON.parse(data)
        
        }catch(e){
          socket.write(JsonInvalidResponse)
          msg = {content: ""} ;
        }

        if (msg.content != ""){
           CHANNEL.send(msg.content);
        }
      });
    });
    server.listen({
      host: ADDRESS,
      port: PORT,
      signal: controller.signal
    });

  controller.abort();
  
  }else{
    // send discord
    var msg;
    message = message.toString()        
    try{ 
      msg = JSON.parse(message)
    
    }catch(e){
      console.log(JsonInvalidResponse)
      msg = {content: ""} ;
    }

    if (msg.content != ""){
       // CHANNEL.send(msg.content);
        
        if(OWNER){
          var ownerId = CHANNEL.guild.ownerId;
          client.users.fetch(ownerId, false).then((user) => {
                user.send(msg.content);
               });
        }else{
          CHANNEL.send(msg.content);
        }



    }

    myEmitter.emit('event:exit_all', data => {
      console.log("event exit")
    });
  }
}
  
// discord bot is ready
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  CHANNEL = client.channels.cache.get(CHANNEL);

  initSocket();
});


// main, loggin discord
client.login(TOKEN);

// exit app when event called
myEmitter.on('event:exit_all', () => {
    setTimeout(() => {
        process.exit()
      }, closeTimeout);
  }
);
