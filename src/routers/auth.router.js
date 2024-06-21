import express from 'express';
import { requireRefreshToken } from '../middlewares/require-refresh-token.middleware.js';
import {AuthController} from "../controllers/auth.controller.js";
import { RegisterValidator } from '../validators/register.validator.js';
import { LoginValidator } from '../validators/login.validator.js';
// import { prisma } from '../utils/prisma.util.js';

const authRouter = express.Router();

const authController = new AuthController();


//회원가입 API 
authRouter.post('/register',RegisterValidator, authController.register);

//회원가입 이메일 인증 API
authRouter.get('/verify-email', authController.verifyEmail);

//로그인 API
authRouter.post('/login',LoginValidator, authController.login);

//refresh토큰 재발급 
authRouter.post('/token',requireRefreshToken, authController.refreshToken);
 



















//로그아웃 API 
authRouter.post('/sign-out', requireRefreshToken, async(req, res, next)=>{
     try{
       const user = req.user;
       //refreshToken 로그아웃시 Null 값
       await prisma.refreshToken.update({
         where:{UserId:user.userId},
         data:{
           refresh_token:null,
         }
       })
   
       return res.status(200).json({
         status: 200,
         message: '로그아웃에 성공했습니다.',
         data:{ID: user.userId},
           });
     }catch(err){
       next(err);
     }
   })
   

   
    



   export default authRouter;
