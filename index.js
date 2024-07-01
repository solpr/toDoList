import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import exphbs from 'express-handlebars';
import tasksRoutes from './source/routes/tasksRoutes.js';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(process.cwd(), 'source/public')));

app.engine('handlebars', exphbs({ defaultLayout: false }));
app.set('view engine', 'handlebars');
app.set('views', path.join(process.cwd(), 'source/public/views'));

app.use('/api', tasksRoutes);

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/form', (req, res) => {
    res.render('form');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
