import {Router} from 'express';
import {setFavourite} from '../services/favouriteService.js';
import {setFavouriteHandler, getFavouritesHandler, getSortedFavouritesHanlder} from '../controllers/favouriteController.js';
import {isAuthenticated} from '../middlewares/auth.js';

const router = Router();


// router.post("/addFavourite", async (req, res) => {
//     try {
//     const userid = req.body.userid;
//     const bookid = req.body.bookid;
//     console.log(userid + bookid);
//     const favourite = await setFavourite(userid, bookid);
//     res.status(201).json({favourite});

//     } catch (err) {
//         res.status(404).json(err.message);
//     } 


// });

router.post("/addFavourite", isAuthenticated, setFavouriteHandler);
router.get("/favourites", isAuthenticated, getFavouritesHandler);
router.get("/sortedFavourites", isAuthenticated, getSortedFavouritesHanlder);

export default router;