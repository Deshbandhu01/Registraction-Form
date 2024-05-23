const express =require("express")
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express ();
dotenv.config();

const port =process.env.PORT || 3000;

const username=process.env.MONGODB_USERNAME;
const password=process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.88sr03a.mongodb.net/registractionFormDB`,{
    useNewUrlParser : true,
    useUnifiedTopology : true,
});

//registractionSchema
const registractionSchema = new mongoose.Schema({
    name : String,
    email: String,
    password :String,
});

//node of registraction schema
const Registraction = mongoose.model("Registractin", registractionSchema);

app.use(bodyParser.urlencoded ({extended: true }));
app.use(bodyParser.json());

app.get("/",(req ,res) => {
    res.sendFile(__dirname +"/pages/index.html")
})

app.post("/register", async (req, res) =>{
    try{
        const{name,email,password} = req.body;

        const existingUser = await Registraction.findOne({email : email});
        //check for register user
        if(!existingUser){
            const registractionData = new Registraction({
                name,
                email,
                password
            });
            await registractionData.save();
            res.redirect("/success");
        }
        else{
            console.log("User alreay exist");
            res.redirect("/error");
        }


        const registractionData = new Registraction({
            name,
            email,
            password
        });
        await registractionData.save();
        res.redirect("/success");
    }
    catch (error){
        console.log(error);
        res.redirect("/error");
    }
})

app.get("/success",(req,res)=>{
    res.sendFile (__dirname+"/pages/success.html");
})
app.get("/error",(req,res)=>{
    res.sendFile (__dirname+"/pages/error.html");
})

app.listen(port, () =>{
    console.log(`Server is running at port ${port}`);
})