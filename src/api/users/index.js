import { Router } from 'express';

import find from './middleware/find';
import findOne from './middleware/findOne';
import createOne from './middleware/createOne';
import deleteOne from './middleware/deleteOne';
import updateOne from './middleware/updateOne';
const router = Router();

// users
router.get('/users', find);
router.post('/users', createOne);

// A user
router.get('/users/:userEmail', findOne);
router.delete('/users/:userEmail', deleteOne);
router.patch('/users/:userEmail', updateOne);

export default router;
