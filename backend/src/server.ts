import 'dotenv/config';
import express from 'express';
import { router } from './routes/index.routes';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(router);

app.listen(PORT, () => console.log(`A mãe tá on na porta ${PORT}`));
