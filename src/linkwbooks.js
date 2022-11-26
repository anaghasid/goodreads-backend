import express from "express"
import cors from "cors"
import mongoose from "mongoose"

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
    password: String
})

const bookSchema = new mongoose.Schema({
    bname: String,
    author: String,
    description: String
})

const User = new mongoose.model("User", userSchema)
const books = new mongoose.model("Book", bookSchema)

//Routes
app.post("/home/:uname", (req, res)=> {
    // we will post the name of the book
    const book = req.body
    res.send("Book is ",book)
    // CHANGE THIS TO USERNAME
    User.findOne({name : "qwerty"},(err,found_user)=>{
        if(found_user)
        {
            console.log("Found user with email",found_user.email)
            User.update({name: "qwerty"}, {$push: {listofbooks: book.uname}});
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

app.listen(9002,() => {
    console.log("backend at port 9002")
})