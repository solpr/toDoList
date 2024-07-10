import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import tasksRoutes from './routes/tasksRoutes.js';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(process.cwd(), 'source/public')));
app.use('/api', tasksRoutes);

export default app;