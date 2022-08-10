import { Router } from 'express';
import { locationRoute } from './Location.routes';
import { tableRoute } from './Table.routes';
import { userRoute } from './User.routes';

const router = Router();

router.use('/users', userRoute);
router.use('/tables', tableRoute);
router.use('/locations', locationRoute);

export { router };
