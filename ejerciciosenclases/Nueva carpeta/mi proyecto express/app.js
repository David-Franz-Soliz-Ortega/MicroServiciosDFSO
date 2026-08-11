const express=require("express");
const app=express();
const port=2998;

app.use(express.urlencoded({extended: false}));

app.get('/',(req, res) => {
    res.send(`
        <form method="POST" action="/calcular">
         <label for="num1">Numero 1:</label>
         <input type="number" id="num1" name="num1">
         
         <label for="num2">Numero 2:</label>
         <input type="number" id="num2" name="num2">
         
         <button type="submit">Calcular suma</button>
        </form>
    `);
});

app.post('/calcular',(req,res)=>{
    const num1=parseInt(req.body.num1);
    const num2=parseInt(req.body.num2);
    const suma=num1+num2;
    res.send(`<h1>La suma es: ${suma}</h1>`);
})

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
