//plural is a REST convention
import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import verifyToken from "../middleware/auth";

const router = express.Router();

router.get("/me", verifyToken, async(req:Request, res: Response)=>{
  const userId = req.userId;
  try {
    const user = await User.findById(userId).select("-password");
    // including password would be a security vulnerabily
    if(!user) {
      return res.status(400).json({ message: "Can't find this user" });
    }
    res.json(user);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Something isn't right"})
  }
})

// /api/users/register
router.post("/register", [
  // express validator below checks if registration is 
  // formatted correctly before processing. 
  check("firstName", "First name required").isString(),
  check("lastName", "Last name required").isString(),
  check("email", "Email required").isEmail(),
  check("password", "Password requires min 6 characters").isLength({ min: 6 }),
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({ message: errors.array() });
  };

  try {
    let user = await User.findOne({
      email: req.body.email,
    });

    if(user){
      return res.status(400).json({ message: "This user already exists" });
    };

    user = new User(req.body);
    await user.save();

    const token = jwt.sign(
      {userId: user.id}, 
      process.env.JWT_SECRET_KEY as string, {
        expiresIn: "1d"
      }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400000
    })
    return res.status(200).send({ message: "User successfully registered" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "somthing isn't right" });
  }
});

export default router;