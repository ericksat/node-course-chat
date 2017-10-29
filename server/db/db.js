const MongoClient = require('mongodb').MongoClient

var mongoDb = null;

// Use connect method to connect to the server
MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
    if (err) {
        console.log("Failed to connect", err)
    } else {
        console.log("Connected successfully to server");

        var collection = db.collection('users');
        // Find some documents
        collection.find({}).toArray(function(err, docs) {
          console.log("Found the following records");
          console.log(docs)
          db.close();
        });
    }
});