const mongoose = require('mongoose');


  async function connectToDB(){
     await mongoose.connect(process.env.Mongo_Uri)
     .then(()=>{
        console.log('Connected to Db');
     })
  }

  module.exports = connectToDB;