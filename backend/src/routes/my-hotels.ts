import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel, { HotelType } from "../models/hotel";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";

const router = express.Router();

// images are not stored locally, rather, they're sent to
// cloudinary via multer.
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    // 5mb
    fileSize: 5 * 1024 * 1024
  }
});

// api/my-hotels
router.post(
  "/", 
  verifyToken, [
    body("name").notEmpty().withMessage("Name Required"),
    body("city").notEmpty().withMessage("City Required"),
    body("state").notEmpty().withMessage("State Required"),
    body("country").notEmpty().withMessage("Country Required"),
    body("description").notEmpty().withMessage("Description Required"),
    body("type").notEmpty().withMessage("Hotel Type Required"),
    body("pricePerNight").notEmpty().isNumeric().withMessage("Price Per Night Required & Must Be Whole Number"),
    body("facilities").notEmpty().isArray().withMessage("Facilities Required"),
  ],
  upload.array("imageFiles", 6), 
  async (req: Request, res: Response) => {
  try {
    const imageFiles = req.files as Express.Multer.File[];
    const newHotel: HotelType = req.body;

    //1. upload images to cloudinary
    // Code below iterates over the image files array we get from
    // the post request that was passed on to us by multer, then 
    // from that, we're encoding the image as a base64 string
    // and creating a string that describes the image so it has
    // an image mimetype, as well as the base64 string attached
    // to it, then we're using the cloudinary SDK to upload
    // this image to our cloudinary account. If that works,
    // we'll get a url back (res.url).
    const uploadPromises = imageFiles.map(async(image) => {
      const b64 = Buffer.from(image.buffer).toString("base64");
      let dataURI="data:" + image.mimetype + ";base64," + b64;
      const res = await cloudinary.v2.uploader.upload(dataURI);
      return res.url;
    });

    //2. if successful, add urls to the new hotel
    const imageUrls = await Promise.all(uploadPromises);
    newHotel.imageUrls = imageUrls;
    newHotel.lastUpdated = new Date();
    newHotel.userId = req.userId;

    //3. save hotel to database
    const hotel = new Hotel(newHotel);
    await hotel.save();

    //4. return 201
    res.status(201).send(hotel);
  } catch (error) {
    console.log("Error making hotel: ", error);
    res.status(500).json({ message: "Something went wrong"})
  }
});

export default router;