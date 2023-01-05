const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose')
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())


mongoose.connect("mongodb://localhost:27017/goodreadsDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("DB connected")
})

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    listofbooks: [{default:{}}],
    ratings : [{default:{}}]
})

const User = new mongoose.model("User", userSchema)

app.get('/books',(req,res)=>{
    MongoClient.connect(url, function(err, db) {
        if (err) 
           console.log(err);
        
        console.log("Helooo");
        var dbo = db.db("goodreadsDB");
        dbo.collection("books").find({}).toArray(function(err, bookresults) {
           if (err) 
               throw err;
            res.send(bookresults)
            console.log(bookresults)
           db.close();
       });
    });
})

//Routes
app.post("/login", (req, res)=> {
    const { email, password} = req.body
    User.findOne({ email: email}, (err, user) => {
        if(user){
            if(password === user.password ) {
                res.send({message: "Login successful", user: user})
            } else {
                res.send({ message: "Password didn't match"})
            }
        } else {
            res.send({message: "User not registered"})
        }
    })
}) 

app.post("/register", (req, res)=> {
    const { name, email, password} = req.body
    // req.body contains the object that is posted from front end (Register.js)
    User.findOne({email: email}, (err, user) => {
        if(user){
            res.send({message: "User already registerd"})
        } else {
            const user = new User({
                name,
                email,
                password
            })
            user.save(err => {
                if(err) {
                    res.send(err)
                } else {
                    res.send( { message: "Successfully registered, Please login now." })
                }
            })
        }
    })
    
}) 

app.post("/books",(req,res)=>{
    const {book, stars} = req.body
    MongoClient.connect("mongodb://localhost:27017/", function(err,db){
        if(err) throw err;
        var dbo = db.db("goodreadsDB");
        var myquery = {Book:book};
        console.log(book)
        var newvalue = {$set:{Stars:stars}};
        dbo.collection("books").findOne(myquery,(err,res)=>{
            console.log(res)
            dbo.collection("books").updateOne(res,newvalue,function(err,res){
            if(err) throw err;
            });
            // db.close();
        })
    })
})

app.listen(9002,() => {
    console.log("backend at port 9002")
})