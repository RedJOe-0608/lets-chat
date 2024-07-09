import express from "express"
import getMessagesForConversation from "../controllers/messagesController.js";

const router = express.Router();

router.get('/', getMessagesForConversation);

export default router;