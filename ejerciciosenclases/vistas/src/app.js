const express=require('express');
const app=express();
const path = require('path');
const port=3000;


app.set('views',path.join(__dirname,'../views'));
app.set('view engine','ejs');

app.use(express.urlencoded({extended:false}));

app.get("/",(req,res)=>{
 res.render('index');
});

app.post("/calcular",(req,res)=>{
    const n1=parseInt(req.body.n1);
    const n2=parseInt(req.body.n2);
    const suma=n1+n2;
    res.render('resultado',{suma})

})
app.listen(port,()=>{
    console.log(`Corriendo en http://localhost:${port}`);
});