import { Router } from 'express';
import listRouter from './lists';
import setHeaders from './middleware/setHeaders';
import userRouter from './users';

const router = Router();

router.use(setHeaders);

router.use(listRouter);

router.use(userRouter);

export default router;
