import { Router } from 'express';
import { tableRoute } from './Table.routes';
import { userRoute } from './User.routes';

const router = Router();

router.use('/users', userRoute);
router.use('/tables', tableRoute);

export { router };
