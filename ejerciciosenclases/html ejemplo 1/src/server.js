const express=require("express");
const port=3000;
const path=require("path");

const app=express();

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'bienvenido.html'));
})

app.listen(port,()=>{
    console.log(`Corriendo en http://localhost:${port}`);
    console.log(__dirname);
})