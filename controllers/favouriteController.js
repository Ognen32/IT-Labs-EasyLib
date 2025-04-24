import {setFavourite, getFavourites, getSortedFavourites} from '../services/favouriteService.js';


export const setFavouriteHandler = async (req, res) => {
    try {
        const userid = req.body.userid;
        const bookid = req.body.bookid;
        const token_data = req.user;
        console.log(userid, bookid, token_data);
        const favourite = await setFavourite(req.user.id, bookid);
        res.status(201).json(favourite);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};


export const getFavouritesHandler = async (req, res) => {
    try {
        const token_data = req.user;
        console.log(token_data);
        const favourites = await getFavourites(req.user.id);
        res.status(200).json(favourites);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
};


export const getSortedFavouritesHanlder = async (req,res) => {
    try {
        const token_data = req.user;
        console.log(token_data);
        const favourites = await getSortedFavourites(req.user.id);
        res.status(200).json(favourites);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}