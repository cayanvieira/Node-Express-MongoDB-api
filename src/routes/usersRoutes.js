import express from "express"
import UserController from "../controllers/userController.js";

const router = express.Router()

router
    .post('/register',UserController.signUp)
    .post('/login',UserController.signIn)


export default router