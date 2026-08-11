const express = require('express');
const app = express();
const port = 3002;

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:false}));

app.get('/', (req, res) => {
    res.render('index', { title: 'Render' });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});