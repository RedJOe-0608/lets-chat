import express from "express"
import { getGroupConversations, getGroupNames } from "../controllers/groupMessagesController.js";

const router = express.Router();

router.get('/',getGroupNames);
router.get('/conversations',getGroupConversations);

export default router;