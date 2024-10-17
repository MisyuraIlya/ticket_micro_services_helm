import express from 'express';
import jwt from 'jsonwebtoken'
import { currentUser } from '@spetsartickets/common';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req, res) => {
    res.status(200).send({currentUser: req.currentUser || null});
});

export { router as currentUserRouter };