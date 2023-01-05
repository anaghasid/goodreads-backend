var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
 if (err) 
    console.log(err);

 var dbo = db.db("goodreadsDB");
 dbo.collection("books").find({}).toArray(function(err, result) {
    if (err) 
        console.log(err);
    console.log(result);
    db.close();
});
});
