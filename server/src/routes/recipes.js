const multer  = require('multer')
const express = require("express");
 
const recipeRoutes = express.Router();
 
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;


const {tryRemoveFile} = require("../common")


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    const uniqueName= Date.now() + '-' + Math.round(Math.random() * 1E9)
    const newName=uniqueName+"."+file.originalname.split('.')[1]
    req.body[file.fieldname]=newName
    cb(null, newName)
  }
})


const upload = multer({ storage: storage })





recipeRoutes.route("/all").get(async function (req, res) {
  let db_connect = dbo.getDb();
  let recipes = await db_connect.collection("recipes").find({}).toArray()
  if (recipes) {
    return res.status(200).json(recipes)
  }
  return res.status(400).json({ "msg": "Error" })
});


recipeRoutes.route("/:id").get(async function (req, res) {

  let db_connect = dbo.getDb();
  query = { _id: ObjectId(req.params.id) }
  let foundRecipe = await db_connect.collection("recipes").findOne(query)
  if (foundRecipe) {
    return res.status(200).json(foundRecipe)
  }
  return res.status(400).json({ "msg": "Error" })
});


recipeRoutes.route("/:id").delete(async function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  try {
    let foundRecipe = await db_connect.collection("recipes").findOne(myquery)
    tryRemoveFile(foundRecipe.image)
    tryRemoveFile(foundRecipe.video)

    let s = await db_connect.collection("recipes").deleteOne(myquery);
    if (s) {
      return res.status(200).json(s)
    }
  }
  catch (e) {
  }
  return res.status(400).json({ "msg": "Error" })
});


recipeRoutes.route("/add").post(upload.any(), async function (req, res) {

  let db_connect = dbo.getDb();


  let recipe = { image: req.body.image, video: req.body.video, title: req.body.title, content: req.body.content, createBy: req.body.createBy }
  // console.log(recipe)
  let s = await db_connect.collection("recipes").insertOne(recipe)
  if (s) {
    // console.log(s)
    return res.status(200).json({})
  }
  return res.status(400).json({ "msg": "Error" })
});

recipeRoutes.route("/editList").post(async function (req, res) {

  let db_connect = dbo.getDb();
  let recipes = await db_connect.collection("recipes").find({ createBy: req.body.userId }).toArray()
  if(recipes){
    return res.status(200).json(recipes)
  }
  return res.status(400).json({ "msg": "Error" })
});



recipeRoutes.route("/edit/:id").put(upload.any(), async function (req, res) {


  let db_connect = dbo.getDb();
  let newRecipe = req.body
  try {

    let oldRecipe = await db_connect.collection("recipes").findOne({ _id: ObjectId(req.params.id) })
    console.log(newRecipe)
    if (newRecipe.image) {
      tryRemoveFile(oldRecipe.image)
    }
    if (newRecipe.video) {
      tryRemoveFile(oldRecipe.video)
    }

    // console.log({ _id: ObjectId(req.params.id) })
    delete newRecipe._id
    let updatedRecipe = await db_connect.collection("recipes").updateOne({ _id: ObjectId(req.params.id) }, { $set: newRecipe })
    return res.status(200).json(updatedRecipe)
  }
  catch (e) {
    console.log(e)
    return res.status(400).json({ "msg": "Error" })
  }
});

module.exports = recipeRoutes;