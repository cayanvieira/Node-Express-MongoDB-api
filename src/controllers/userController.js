import users from "../models/User.js"
import bcrypt from "bcrypt"
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()

class UserController{

    static signUp = async (req,res)=>{
        const {name,email,password,confirmPassword} = req.body
        const userExist = await users.findOne({email:email})

        //virificando dados necessarios para o cadastro do usuário

        if(!name){
           return res.status(422).send({message:"O campo 'nome' é obrigatorio"})
        }
        if(!email){
            return res.status(422).send({message:"O campo 'e-mail' é obrigatorio"})
        }
        if(userExist){
            return res.status(422).send({message:`E-mail já casdatrado.`})
        }        
        if(!password){
            return res.status(422).send({message:"O campo 'senha' é obrigatorio"})
        }
        if(password != confirmPassword){
            return   res.status(422).send({message:`Senha e confirmação de senha não são iguais.`})
        }
        

        //criptografando senha

        const salt = bcrypt.genSaltSync(10)
        const passwordHash = bcrypt.hashSync(password,salt)

        const user = new users({
            name,
            email,
            password:passwordHash
        })

        return await user.save((err)=>{
            if(err){
                return res.status(500).send({message:`${err.message}-falha ao registrar usuário.`})
            }else{
                return res.status(201).send(user.toJSON())
            }
        })
    }

    static signIn = async (req,res)=>{
       
        const {email,password} = req.body

        if(!email){
            return res.status(422).send({message:" Campo e-mail vazio"})
        }
        if(!password){
            return res.status(422).send({message:" Campo senha vazio"})
        }

        
        // verificando se o usuário existe

        const user = await users.findOne({email:email})
        
        
        if(!user){
            return res.status(404).send({message:"Usuário não encontrado"})
        }

        //verificando a senha do usuário

        const checkPassword = await bcrypt.compare(password,user.password)

        if(!checkPassword){
            return res.status(422).send({message:'Usuário não cadastrado'})
        }
    
        try{
            const secret= process.env.JWT_SECRET
            
            const token = jwt.sign(
                {
                id: user._id
                },
                secret,
            )
            

            return res.status(200).send({message:'Usuário autenticado com sucesso',token})
            
        }catch(err){
            res.status(422).send({message:'Não foi possível autenticar o usuário'})
        }

    }

    static checkToken(req,res,next){

        const authHeader = req.headers['authorization']
        let token = null
        
        if(authHeader){
            token = authHeader.split(' ')[1]
        }
        
        if(!token){
            return res.status(401).send({message:'Access deny'})
        }

        try {
            const secret = process.env.JWT_SECRET
            
            jwt.verify(token,secret)
            
            next()

        } catch (error) {
            return res.status(400).send({message:'Token Invalido!'})
        }
    }
}

export default UserController