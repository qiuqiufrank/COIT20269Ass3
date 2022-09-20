const { json } = require("express");
const express = require("express");
 
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();
 
// This will help us connect to the database
const dbo = require("../db/conn");
 
// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;
 
 
// This section will help you get a list of all the records.
recordRoutes.route("/register").post(async function (req, res) {
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

recordRoutes.route("/login").post(async function (req, res) {
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

  // res.json({success:"ok"})

  //  let db_connect = dbo.getDb("employees");
  //  db_connect
  //    .collection("records")
  //    .find({})
  //    .toArray(function (err, result) {
  //      if (err) throw err;
  //      res.json(result);
  //    });
});
 
// This section will help you get a single record by id
recordRoutes.route("/record/:id").get(function (req, res) {
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
recordRoutes.route("/record/add").post(function (req, response) {
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
recordRoutes.route("/update/:id").post(function (req, response) {
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
recordRoutes.route("/:id").delete((req, response) => {
 let db_connect = dbo.getDb();
 let myquery = { _id: ObjectId(req.params.id) };
 db_connect.collection("records").deleteOne(myquery, function (err, obj) {
   if (err) throw err;
   console.log("1 document deleted");
   response.json(obj);
 });
});
 
module.exports = recordRoutes;