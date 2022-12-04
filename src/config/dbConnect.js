import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.i9w22ed.mongodb.net/?retryWrites=true&w=majority`)

const db = mongoose.connection

db.on("error", console.log.bind(console, "Erro de conexão"))
db.once("open", () => {
    console.log("Conexão com o MongoDB feita com sucesso")
})

export default db

