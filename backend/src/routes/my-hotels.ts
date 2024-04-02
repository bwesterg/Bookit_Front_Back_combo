import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel from "../models/hotel";
import { HotelType } from "../shared/types";
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
    const imageUrls = await uploadImages(imageFiles);
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

//view hotels
router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId })
    res.json(hotels);
    
  } catch (error) {
    res.status(500).json({ message: "Could not fetch hotels" });
  }
});

//edit hotel
router.get("/:id", verifyToken, async (req: Request, res: Response) => {
  const id = req.params.id.toString();
  try {
    // const hotel = await Hotel.find({
    // ^^^ this returns an array of hotel(s),
    // but I only one one, and the front end
    // is expecting an object of one hotel, and
    // not an array of hotel(s)
    const hotel = await Hotel.findOne({
      _id: id,
      userId: req.userId
    });
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch hotels" })
  }
});

router.put(
  "/:hotelId",
  verifyToken, 
  upload.array("imageFiles"), 
  async(req: Request, res: Response) => {
    try {
      const updatedHotel: HotelType = req.body;
      updatedHotel.lastUpdated = new Date();
      const hotel = await Hotel.findOneAndUpdate({
        _id: req.params.hotelId,
        userId: req.userId,
      }, updatedHotel, { new: true });

      if(!hotel){
        return res.status(404).json({ message: "hotel not found" });
      }

      const files = req.files as Express.Multer.File[];
      const updatedImageUrls = await uploadImages(files);

      hotel.imageUrls = [
        ...updatedImageUrls, 
        ...(updatedHotel.imageUrls || []),
        //case where user deletes all images
      ];

      await hotel.save();
      res.status(201).json(hotel);
    } catch (error) {
      res.status(500).json({ message: "could not update hotel" });
    }
  }
);


async function uploadImages(imageFiles: Express.Multer.File[]) {
  const uploadPromises = imageFiles.map(async (image) => {
    const b64 = Buffer.from(image.buffer).toString("base64");
    let dataURI = "data:" + image.mimetype + ";base64," + b64;
    const res = await cloudinary.v2.uploader.upload(dataURI);
    return res.url;
  });
  
  //2. if successful, add urls to the new hotel
  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
}

export default router;