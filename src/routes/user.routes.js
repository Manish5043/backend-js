import {Router} from "express";
import { registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"

const router = Router()

router.route("/register").post(
    // ye neeche ki functionality mein humne middleware lagya hana ki 3rd party use kiya h 
    upload.fields([
        {
           name: "avatar",
           maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount:1
        }
    ]),
    registerUser)

export default router