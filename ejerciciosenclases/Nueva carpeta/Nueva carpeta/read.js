const fs=require('fs');

fs.readFile('archivo.txt', 'utf8', (err,data)=>{
    if(err){
        console.error(err);
    }catch (err){
        console.error(err); 
    }
    }
});