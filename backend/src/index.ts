import 'dotenv/config';
// dotenv.config({ path: '/full/custom/path/to/your/env/vars' });
// dotenv.config({ path: './../..' })
import express from 'express';
import sinkRoutes from './routes/sinkRoutes';
import sourceRoutes from './routes/sourceRoutes';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('howdy there!');
});

app.use('/consumer', sinkRoutes);
app.use('/source', sourceRoutes);

app.listen(process.env.PORT ?? 3000, () => {
  console.log('Server Running');
});
