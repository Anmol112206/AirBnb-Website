const express= require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});  //it automatically creates a folder to save the files

const listingController = require("../controllers/listing.js");

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing));
    

//NEW ROUTE
//placing new route below read searches for the id named new that why should be placed above
router.get("/new" ,isLoggedIn,listingController.renderNewForm)

router.route("/:id")
    .get(wrapAsync(listingController.ShowListing))
    .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.UpdateListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));

//EDIT ROUTE
router.get("/:id/edit",isOwner,wrapAsync(listingController.renderEditForm))

//findOneAndDelete is a middleware for this route

module.exports = router;