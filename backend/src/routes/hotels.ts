import express, { Request, Response} from "express";
import Hotel from "../models/hotel";
import { HotelSearchResponse } from "../shared/types";
import { param, validationResult } from "express-validator";

// api/hotels/search?
const router = express.Router();



router.get("/search", async (req: Request, res: Response) => {
  try {
    // implement pagination b/c a search of thousands of pages
    // would be 'expensive.'
    const query = constructSearchQuery(req.query);
    let sortOptions = {};
    switch(req.query.sortOption){
      case "starRating":
        sortOptions = { starRating: -1 };
        break;
      // Asc for ascending
      case "pricePerNightAsc":
        sortOptions = { pricePerNight: 1 };
        break;
      case "pricePerNightDesc":
        sortOptions = { pricePerNight: -1 };
        break;
    }

    const pageSize = 8;
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : "1"
    );
    const skip = (pageNumber - 1) * pageSize;

    const hotels = await Hotel.find(query).sort(sortOptions).skip(skip).limit(pageSize);
    const total = await Hotel.countDocuments(query);
    const response: HotelSearchResponse = {
      data: hotels,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total/pageSize),
      },
    };
    res.json(response);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Something isn't wokring" });
  }
});

// /api/hotels/3839854894390etc for info about hotel
router.get("/:id", [
  param("id").notEmpty().withMessage("Id associated with hotel required")
], async (req: Request, res: Response)=> {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const id = req.params.id.toString();
  try {
    const hotel = await Hotel.findById(id);
    res.json(hotel);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Could not fetch hotel" });
  }
})

const constructSearchQuery = (queryParams: any) => {
  let constructedQuery: any = {};

  if (queryParams.destination) {
    constructedQuery.$or = [
      { city: new RegExp(queryParams.destination, "i") },
      { country: new RegExp(queryParams.destination, "i") },
    ];
  }

  if (queryParams.adultCount) {
    constructedQuery.adultCount = {
      $gte: parseInt(queryParams.adultCount),
    };
  }

  if (queryParams.childCount) {
    constructedQuery.childCount = {
      $gte: parseInt(queryParams.childCount),
    };
  }

  if (queryParams.facilities) {
    constructedQuery.facilities = {
      // $all is a mongoose filter
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities]
    };
  }

  if (queryParams.types) {
    constructedQuery.type = {
      // hotel has only one type, but user can select many
      // hotel types in their search
      $in: Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types]
    };
  }

  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
      ? queryParams.stars.map((star: string) => parseInt(star))
      : parseInt(queryParams.stars);

    constructedQuery.starRating = { $in: starRatings };
  }

  if (queryParams.maxPrice) {
    constructedQuery.pricePerNight = {
      $lte: parseInt(queryParams.maxPrice).toString()
    };
  }

  return constructedQuery;
};

export default router;