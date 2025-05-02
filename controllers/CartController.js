import {handleCartAdd} from '../services/cartService.js';


export const handlerCartAdd = async (req, res) => {
    try {
    const userid = req.user.id;
    const bookid = req.body.bookid;
    const itemAdd = await handleCartAdd(userid, bookid);
    res.status(201).json(itemAdd);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};