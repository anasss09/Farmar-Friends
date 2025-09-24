import express from 'express'
import { home, postLogin, postSignup } from '../controller/auth.js';
import upload from '../utils/multer.js';

const router = express.Router()

// Get Routes
router.get('/', home)

// POST Routes
router.post('/login', postLogin)
router.post('/signup', upload.single('image'), postSignup)

export default router;