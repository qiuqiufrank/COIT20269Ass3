const { json } = require("express");
const express = require("express");
const multer  = require('multer')
 
// userRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const userRoutes = express.Router();
 
// This will help us connect to the database
const dbo = require("../db/conn");
const {tryRemoveFile} = require("../common")
 
// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;
 


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    const uniqueName= Date.now() + '-' + Math.round(Math.random() * 1E9)
    const newName=uniqueName+"."+file.originalname.split('.')[1]
    req.body.newName=newName
    cb(null, newName)
  }
})


const upload = multer({ storage: storage })



userRoutes.route("/basic/:id").get(async function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) }
  console.log(myquery)
  let foundUser= await db_connect.collection("users").findOne(myquery)
  if ( foundUser) {
    return res.status(200).json({name:foundUser.name,avatar:foundUser.avatar})
  }
  return res.status(400).json({ "msg": "Error" })
});
 

userRoutes.route("/avatar/:id").put(upload.any(),async function (req, res) {

  let newName=req.body.newName

  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) }
  let foundUser= await db_connect.collection("users").findOne(myquery)
  tryRemoveFile(foundUser.avatar)

  let updatedUser= await db_connect.collection("users").updateOne(myquery, { $set: {avatar:newName}})
  if(updatedUser){
    return res.status(200).json({avatar:newName})
  }
  return res.status(400).json({ "msg": "Error" })

})


// This section will help you get a list of all the records.
userRoutes.route("/register").post(async function (req, res) {
  let user = req.body
  let myquery = { email: user.email };
  let db_connect = dbo.getDb();
  let foundUser = await db_connect.collection("users").findOne(myquery)
  if (!foundUser) {
    let s = await db_connect.collection("users").insertOne(user)
    if (s) {
      return res.status(200).json({})
    }
  }
  else {
    return res.status(400).json({ "msg": "Error, email has been registered!" })
  }
  return res.status(500).json({ "msg": "Internal Error" })

})

userRoutes.route("/login").post(async function (req, res) {
  let user = req.body
  let myquery = { email: user.email };
  let db_connect = dbo.getDb();
  let foundUser = await db_connect.collection("users").findOne(myquery)
  // console.log(user)
  // console.log(foundUser)
  if (foundUser) {
    // console.log(foundUser)
    if (foundUser.password==user.password){
      // console.log("succes")
      delete foundUser.password
      return res.status(200).json( foundUser)
    }
  }
  else {
    return res.status(400).json({ "msg": "Error, email or password is wrong!" })
  }
  return res.status(500).json({ "msg": "Internal Error" })
});
 
// This section will help you get a single record by id
userRoutes.route("/record/:id").get(function (req, res) {
 let db_connect = dbo.getDb();
 let myquery = { _id: ObjectId(req.params.id) };
 db_connect
   .collection("records")
   .findOne(myquery, function (err, result) {
     if (err) throw err;
     res.json(result);
   });
});
 
// This section will help you create a new record.
userRoutes.route("/record/add").post(function (req, response) {
 let db_connect = dbo.getDb();
 let myobj = {
   name: req.body.name,
   position: req.body.position,
   level: req.body.level,
 };
 db_connect.collection("records").insertOne(myobj, function (err, res) {
   if (err) throw err;
   response.json(res);
 });
});
 
// This section will help you update a record by id.
userRoutes.route("/update/:id").post(function (req, response) {
 let db_connect = dbo.getDb();
 let myquery = { _id: ObjectId(req.params.id) };
 let newvalues = {
   $set: {
     name: req.body.name,
     position: req.body.position,
     level: req.body.level,
   },
 };
 db_connect
   .collection("records")
   .updateOne(myquery, newvalues, function (err, res) {
     if (err) throw err;
     console.log("1 document updated");
     response.json(res);
   });
});
 
// This section will help you delete a record
userRoutes.route("/:id").delete((req, response) => {
 let db_connect = dbo.getDb();
 let myquery = { _id: ObjectId(req.params.id) };
 db_connect.collection("records").deleteOne(myquery, function (err, obj) {
   if (err) throw err;
   console.log("1 document deleted");
   response.json(obj);
 });
});
 
module.exports = userRoutes;