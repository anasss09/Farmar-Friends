import express from 'express'
import { getLogout, postLogin, postSignup, getGoogleCallback } from '../controller/auth.js';
import upload from '../utils/multer.js';
import passport from "passport";

const router = express.Router()

// POST Routes
router.post('/login', postLogin)
router.post('/signup', upload.single('image'), postSignup)
router.get('/logout', getLogout);

// Google login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  getGoogleCallback
);


export default router;