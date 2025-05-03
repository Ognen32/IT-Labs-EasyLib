import {handleCartAdd, handlegetCartItems, handleCartSubmit} from '../services/cartService.js';


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

export const handlerCartItems = async (req, res) => {
    try {
        const userid = req.user.id;
        const items = await handlegetCartItems (userid);
        res.status(200).json(items);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const handlerCartSubmit = async (req, res) => {
    try {
        const userid = req.user.id;
        const submitCart = await handleCartSubmit(userid);
        res.status(201).json({
            message: "Created Transcation",
            submitCart
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};