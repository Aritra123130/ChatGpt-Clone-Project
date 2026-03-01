const { Server } = require("socket.io");
const cookie = require("cookie");
// const httpServer = createServer(app);
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.models')
const aiService = require('../service/ai.service')
const messagemodel = require('../models/message.model')
const {createMemory,queryMemory} = require('../service/vector.service');
// const { chat } = require("@pinecone-database/pinecone/dist/assistant/data/chat");
 function initSocket(httpServer){
  const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            allowedHeaders: [ "Content-Type", "Authorization" ],
            credentials: true
        }
    });

io.use(async(socket,next)=>{
     const cookies = cookie.parse(socket.handshake.headers?.cookie||"");

     if(!cookies.token){
      next(new Error('Authentication error: No token provided'));
     }
       try{
           const decoded = jwt.verify(cookies.token,process.env.Jwt_Secret);
           const user = await userModel.findById(decoded.id);
           socket.user=user;
           next();
       }catch(err){
         next(new Error('No token provided'));
       }
     console.log('The cookie is',cookies);
  })
  io.on("connection", (socket) => {
  // ...
  console.log(socket.user);
  console.log(socket.id);


  socket.on('ai-message',async(messagepayload)=>{
    console.log(messagepayload);

    const message =  await messagemodel.create({
       chat:messagepayload.chat,
       user:socket.user._id,
       content:messagepayload.message,
       role:'user'
     })

      const vectors = await aiService.generateVector(messagepayload.message);
      console.log(vectors);
      console.log('The message id is',messagepayload.chat);
      console.log('The user id is',socket.user._id);

  const memory = await queryMemory({
  queryVector:vectors,
  limit: 1,
  metadata: {
    user: socket.user._id
  }
})
    console.log('The memory is',memory);
    await createMemory({
   
  messageId: message._id , // You can generate a unique ID for each message, e.g., using UUID
  vectors,
  metadata: {
    chat: messagepayload.chat,
    user: socket.user._id,
    text: messagepayload.message
  }
});


console.log('The memory is',memory);
      const chathistory = (
  await messagemodel
    .find({ chat: messagepayload.chat })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean()
).reverse();
    //  console.log();

    const stm = chathistory.map((item)=>{
       return {
        role:item.role,
        parts:[{text:item.content}]
       }
     })

      const ltm = [
                {
                    role: "user",
                    parts: [ {
                        text: `

                        these are some previous messages from the chat, use them to generate a response

                        ${memory.map(item => item.metadata.text).join("\n")}
                        
                        ` } ]
                }
            ]

         console.log(ltm[0]);
         console.log(stm);

    const response  = await aiService.GenerateResponse([...stm,...ltm]);
    

    const responseMessage = await messagemodel.create({
       chat:messagepayload.chat,
       user:socket.user._id,
       content:response,
       role:'model'
     })

     const responseVectors = await aiService.generateVector(response);

     await createMemory({
      vectors:responseVectors,
      messageId: responseMessage._id,
      metadata:{
        chat:messagepayload.chat,
        user:socket.user._id,
        text:response
      }

     })

    socket.emit('ai-response',{
      content:response,
      chat:messagepayload.chat
    })
  })
});
}


module.exports = initSocket;