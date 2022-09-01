import mongoose from "mongoose";

mongoose.connect("mongodb+srv://cayanvieira:1234@alura.om0ht.mongodb.net/?retryWrites=true&w=majority")

const db = mongoose.connection

export default db

