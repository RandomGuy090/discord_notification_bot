Notification discord bot
========================

# install 
```
npm install
```
packages:  
    - [discord.js](https://discord.js.org/#/)

# usage
```
./discord_notify.js 

  discord notification bot
  flags:
  -a  --address   socket server ip address
  -p  --port      socket server port
  -c  --channel   discord channel id (to send notification)
  -m  --message   message content
  -t  --token     discord bot token
  -h  --help      printout help message

```
## example

```
./discord_notify.js  -t <your discord token> -c <channel id> -m <message>
```
or set up socket server
```
./discord_notify.js  -t <your discord token> -c <channel id> -p <socket port> -a <socket address>
```
