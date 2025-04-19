import express from 'express'
import { authenticate , restrict} from '../auth/verifyToken.js';
import { accessChat,} from '../Controllers/chatController.js';


const router = express.Router();

router.post('/', authenticate, accessChat );


export default router