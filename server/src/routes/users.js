const express = require("express");
const multer  = require('multer')
 
const userRoutes = express.Router();
 
const dbo = require("../db/conn");
const {tryRemoveFile} = require("../common")
 
const ObjectId = require("mongodb").ObjectId;
 


/**
 * Store avatar images into the uploads folder
 */
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



/**
 * asking for basic information of a user
 */
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
 

/**
 * Update avatar image file
 */
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


/**
 * handle register data
 */
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

/**
 * handle authentication for login
 */
userRoutes.route("/login").post(async function (req, res) {
  let user = req.body
  let myquery = { email: user.email };
  let db_connect = dbo.getDb();
  let foundUser = await db_connect.collection("users").findOne(myquery)
  if (foundUser) {
    if (foundUser.password==user.password){
      delete foundUser.password
      return res.status(200).json( foundUser)
    }
  }
  else {
    return res.status(400).json({ "msg": "Error, email or password is wrong!" })
  }
  return res.status(500).json({ "msg": "Internal Error" })
});
 
 
module.exports = userRoutes;