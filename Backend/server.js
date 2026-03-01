
require('dotenv').config();
const app = require('./src/app');
const connectToDb = require('./src/config/database');
const initSocket = require('./src/sockets/socket.server');
const httpServer = require('http').createServer(app);
 connectToDb();

 initSocket(httpServer);
 
httpServer.listen(3000,()=>{

   
    console.log('Server is Running');
})