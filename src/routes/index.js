import express from "express";
import livros from "./livrosRoutes.js"
import users from "./usersRoutes.js"
import User from "../models/User.js"
import UserController from "../controllers/userController.js";



const routes = (app) =>{

    app.route('/').get((req, res) =>{
        res.status(200).send({titulo:"Servidor Ligado"})
    })
    app.route('/public').get((req, res) =>{
        res.status(200).send({titulo:"Rota pública"})
    })
    app.route('/private/:id').get(UserController.checkToken, async(req, res) =>{
        
        const id = req.params.id

        const user = await User.findById(id,'-password')
        
        if(!user){
            return res.status(404).send({message:"Usuário não encontrado"})
        }

        res.status(200).send({message:user})
    })
    
    
    app.use(
        express.json(),
        livros,
        users
    )
}

export default routes
