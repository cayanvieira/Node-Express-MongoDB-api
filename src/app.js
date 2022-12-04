import express from "express";
import db from "./config/dbConnect.js"
import routes from"./routes/index.js"
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

dotenv.config()

const app = express()

routes(app)

export default app