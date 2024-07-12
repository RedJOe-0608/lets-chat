import express from "express"
import { getMyGroups } from "../controllers/messagesController.js";

const router = express.Router();

router.get('/',getMyGroups);

export default router;