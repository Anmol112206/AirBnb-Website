const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
    .then(()=>{
        console.log("connection successful");
    })
    .catch((err) => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');   //by default connect to test database
}

//... is the way to spread all the data to store something
const initDB = async ()=>{
    await Listing.deleteMany({});   //to delete any previous data
    initData.data = initData.data.map((obj)=>({...obj, owner:"67fe3e8092608ed223354820"}));  //way to add any new column in the database
    await Listing.insertMany(initData.data);
    console.log("data was initialised");
}

initDB();