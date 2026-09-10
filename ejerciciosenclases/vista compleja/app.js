const express=require("express");
const port=3000;
const app=express();

app.set('views','./views');
app.set('view engine','ejs');

app.use(express.urlencoded({extended:false}));

app.get('/',(req,res)=>{
    res.render("index", { tabla: '' });
})

app.post("/tabla",(req,res)=>{
    Numcol=parseInt(req.body.ncol);
    Numfila=parseInt(req.body.nfila);
    let tabla='<table border="1">';
    for(let i=0;i<Numfila;i++){
        tabla+= '<tr>';
        for(let j=0;j<=Numcol;j++){
            tabla+='<td>Celda</td>';
        }
        tabla+='</tr>';
    }
    tabla+='</table>'
    res.render('index',{tabla});
})

app.listen(port,()=>{
    console.log(`Corriendo en http://localhost:${port}`);
})