const { MongoClient } = require("mongodb");
//const connectionString = process.env.ATLAS_URI;
const connectionString ="mongodb+srv://qiu:e5impDOFd9QyJP9H@cluster0.xutp1uu.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let dbConnection;

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      if (err || !db) {
        return callback(err);
      }

      dbConnection = db.db("Ass3");
      console.log("Successfully connected to MongoDB.");

      return callback();
    });
  },

  getDb: function () {
    return dbConnection;
  },
};