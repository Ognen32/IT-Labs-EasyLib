import {Router} from 'express';

const router = Router();


router.post("/book", (req, res) => {
    const email = req.body.email;
    res.json(email);
});


export default router