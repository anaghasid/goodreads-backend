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
    password: String,
    listofbooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'books', default:{} }],
    ratings : [{default:{}}]
})

const User = new mongoose.model("User", userSchema)

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

const bookSchema = new mongoose.Schema({
    bname: String,
    author: String,
    description: String
})

const books = new mongoose.model("Book", bookSchema)

//Routes
app.post("/home/:uname", (req, res)=> {
    // we will post the name of the book
    const book = req.body
    console.log(book)
    User.findOne({name : uname},(err,found_user)=>{
        if(found_user)
        {
            User.update({name: uname}, {$push: {listofbooks: book.uname}});
            console.log("updated")
        }
        if(err)
        {
            throw err
        }
    })
}) 


app.listen(9002,() => {
    console.log("backend at port 9002")
})