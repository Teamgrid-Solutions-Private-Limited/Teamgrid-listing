const User = require('../models/userSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const upload = require('../middlewares/upload');
const BASE_URL = process.env.BASE_URL || "http://localhost:4000/";
const upload_URL = `${BASE_URL}images/`;


class userController{

    static userAdd = async (req,res)=>{
        try {
            
            upload.single(profile_picture)(req,res,async(err)=>{
                if(err){
                    res.status(500).json({error:err.message});
                }
                const {firstName,lastName,email,password,phone,role} = req.body;

                const existingUser = await user.findOne({email:email});
                if(existingUser){
                    return res.status(400).json({error:"user already exists"});
                }
                let hashedPassword = undefined;
                hashedPassword = await bcrypt.hash(password,10);
                const user=new User({
                    firstName,
                    lastName,
                    email,
                    password:hashedPassword,
                    phone,
                    role,
                    profile_picture:req.file?`${upload_URL}${req.file.filename}`:undefined
                })
                const savedUser = await user.save();
                res.status(201).json({message:"user created successfully",user:savedUser});

            })
        } catch (error) {
            console.error(error);
            res.status(500).json({error:error.message});
            
        }

    }

    static userLogin = async (req,res) => {
        try {
            const {email,password}= req.body;
            const user = await User.findOne({email:email});
            if(!user){
                return res.status(404).json({error:"user not found"});
            }

            const validPassword = await bcrypt.compare(password,user.password);
            if(!validPassword){
                return res.status(400).json({error:"invalid password"});
            }

            const token = jwt.sign({
                email:user.email,
                role:user.role,
                userId:user._id,
            },process.env.JWT_SECRET,{expiresIn:"30d"});

            res.status(200).json({message:"login successful",token});
        } catch (error) {
        res.status(500).json({error:error.message});    

        }
        
    }

    static getAllUsers = async (req,res)=>{
        try {
            const users = await User.find();
            res.status(200).json({users});
        } catch (error) {
            res.status(500).json({error:error.message});
        }
    }
    static getUserById = async (req,res) => {
        try {
            
            const {id}=req.params;
            const user = await User.findById(id);
            if(!user)
                {
                    return res.status(404).json({error:"user not found"});
                }
                res.status(200).json({message:"user retrived successfully",info:user});
        } catch (error) {
            
            res.status(500).json({message:" server error",error:error.message});
        }
        
    }

    static updateUser = async (req,res) => {
        try{

            upload.single(profile_picture)(req,res,async(err)=>{
                if(err){
                    res.status(500).json({error:err.message});
                }
                if(req.file){
                    req.body.profile_picture = `${upload_URL}${req.file.filename}`;
                }
                const {id}=req.params;
                const updatedUser = await User.findByIdAndUpdate(id,req.body,{new:true});
                if(!updatedUser){
                    return res.status(404).json({error:"user not found"});
                }
                res.status(200).json({message:"user updated successfully",info:updatedUser});
            });

        }catch(error){
            res.status(500).json({message:"server eroor ",error:error.message});
        }
        
    }

    static deleteUser = async (req,res) => {
        try {
            const {id}=req.params;
            const user = await User.findByIdAndDelete(id);
            if(!user){
                return res.status(404).json({error:"user not found"});
            }
            res.status(200).json({message:"user deleted successfully"});
        } catch (error) {
            res.status(500).json({message:"server error",error:error.message});
        }
    }
}
module.exports=userController;