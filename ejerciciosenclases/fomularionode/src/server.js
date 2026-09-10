const express=require("express");
const port=3000;
const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.get('/',(req,res)=>{
    res.send(`<form method="POST" action="/calcular">
        <label>Suma dos numeros</label><br>
        <label>n1</label><br>
        <input type="number" id="n1" name="n1"><br>
        <label>n2</label><br>
        <input type="number" id="n2" name="n2"><br>
        <select name="select" id="select">
        <option value="suma">Sumar</option>
        <option value="resta">Restar</option>
        <option value="mult">Multiplicar</option>
        <option value="division">Dividir</option>
        </select><br>
        <button type="submit">Calcular</button>
        </form>`);
});

app.post('/calcular',(req,res)=>{
    const num1=parseInt(req.body.n1);
    const num2=parseInt(req.body.n2);
    const operador=req.body.select;
    console.log(operador);
    let resultado=0;
    switch(operador){
        case "suma":
            resultado=num1+num2;
            break;
        case "resta":
            resultado=num1-num2;
            break;
        case "mult":
            resultado=num1*num2;
            break;
        case "division":
            resultado=num1/num2;
            break;
    }
    
    res.send(`El resultado es ${resultado}`);
});



app.listen(port,()=>{
  console.log(`Servidor escuchando en http://localhost:${port}`);
})

