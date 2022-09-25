
var express = require('express');
var multer = require('multer');
var cors = require("cors");
// get MongoDB driver connection
const dbo = require('./db/conn');

const PORT = process.env.PORT || 5000;

var upload = multer();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(upload.array()); 
app.use('/uploads', express.static('uploads'))

app.use("/user",require('./routes/users'));
app.use("/recipe",require('./routes/recipes'));


/**
 * Easy to delete all data, testing only
 */
app.use("/resetAll", async (req, res, next) => {
  let db_connect = dbo.getDb();
  try {
    await db_connect.collection("recipes").deleteMany({})
    await db_connect.collection("users").deleteMany({})

    fs.readdir("uploads", (err, files) => {
      if (err) throw err;

      for (const file of files) {
        fs.unlink(path.join(directory, file), err => {
          if (err) throw err;
        });
      }
    });


    return res.status(200).json({"msg":"Reset All"})
  }
  catch {
    return res.status(400).json({ "msg": "Error" })

  }
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

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
