const fs=require('fs');

fs.writeFile('archivo.txt',"Hola desde node", (err)=>{
    if(err) throw err;
    console.log('Archivo creado');
});