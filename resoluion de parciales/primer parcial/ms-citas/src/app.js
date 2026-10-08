const express=require("express");
const app=express();
const port=3001;

app.use(express.json());


app.get("/",(req,res)=>{
    res.send("Deberias ver esto");
});

app.post("/",(req,res)=>{
   
});

app.listen(port,()=>{
    console.log(`http://localhost:${port}`);
});