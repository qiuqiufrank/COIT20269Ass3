// const express = require("express");
// var cors = require("cors");
// const { MongoClient, ServerApiVersion } = require("mongodb");

// const app = express();
// const port = 3000;

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// const uri =
//   "11mongodb+srv://qiu:e5impDOFd9QyJP9H@cluster0.xutp1uu.mongodb.net/?retryWrites=true&w=majority11";

// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverApi: ServerApiVersion.v1,
// },

// );

// let collection = null;

// client.connect(async (err) => {
//   if (!err) {
//     console.log("Database connected!");
//   }
//   collection = client.db("Ass3").collection("Users");
// });
// /**
//  * save data to mongodb
//  * @param {*} fruits 
//  */
// async function saveData(fruits) {
//   await collection.insertMany(fruits);
// }
// /**
//  * get data from mongodb
//  * @returns 
//  */
// async function getData() {
//   let data = await collection.find({});
//   let fruits = await data.toArray();
//   return fruits;
// }
// /**
//  * delete all data in mongodb
//  * @returns 
//  */
// async function deleteAll() {
//   let data = await collection.deleteMany({});
//   console.log(data)
//   return data;
// }
// /**
//  * get request full url
//  * @param {*} req 
//  * @returns 
//  */
// function getFullUrl(req){
//   var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
//   return fullUrl
// }

// /**
//  * static resources
//  */
// app.use("/static", express.static("static"));

// /**
//  * get fruits data
//  */
// app.get("/get", async (req, res) => {
//   try{
//     var fruits = await getData();
//   }
//   catch(e){
//     return res.status(500).json({msg:e.toString()});
//   }
//   var fullUrl = getFullUrl(req)
//   console.log(`${fullUrl}, ${fruits.length} documents have been retrieved`)
//   return res.status(200).json({msg:"Data has been fetched",fruits});
// });

// /**
//  * upload fruits data
//  */
// app.post("/upload", async (req, res) => {
//   try {
//     await saveData(req.body);
//   } catch (e) {
//     return res.status(500).json({ msg: e.toString() });
//   }
//   var fullUrl = getFullUrl(req)
//   console.log(`${fullUrl}, ${req.body.length} documents have been saved`)
//   return res.status(200).json({ msg: "Data has been uploaded" });
// });

// /**
//  * delete all fruits data
//  */
// app.delete("/deleteAll", async (req, res) => {
//   try {
//     await deleteAll();
//   } catch (e) {
//     return res.status(200).json({ msg: e.toString() });
//   }
//   var fullUrl = getFullUrl(req)
//   console.log(`${fullUrl}, all documents have been deleted`)
//   return res.status(200).json({ msg: "All data has been deleted" });
// });

// app.listen( process.env.PORT ||port, () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// });


const express = require('express');
const cors = require('cors');


// get MongoDB driver connection
const dbo = require('./db/conn');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/user",require('./routes/users'));

// Global error handling
app.use(function (err, _req, res) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// perform a database connection when the server starts
dbo.connectToServer(function (err) {
  if (err) {
    console.error(err);
    process.exit();
  }

  // start the Express server
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
});
