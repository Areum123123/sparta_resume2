import express from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../utils/prisma.util.js';
import jwt from 'jsonwebtoken';
import authMiddleware from '../middlewares/auth.middleware.js';
import { requireRefreshToken } from '../middlewares/require-refresh-token.middleware.js';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import {ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY} from '../constants/env.constant.js'

const router = express.Router();
// router.get('/token', async(req, res, next)=>{
//   return res.status(200).json({message: '이게 맞는가?',})
  
// })
//refresh토큰 재발급 
router.post('/token',requireRefreshToken, async(req, res, next)=>{
  try{
     const user = req.user; //미들웨어인증받은 user
     const payload = { userId: user.userId };
     
 
     // const payload = {userId : user.userId};
 
     const accessToken = jwt.sign(
       payload,
       ACCESS_TOKEN_SECRET_KEY,
       { expiresIn: '12h' },
     );
     //refresh토큰  발급
   const refreshToken = jwt.sign(
     payload,
     REFRESH_TOKEN_SECRET_KEY,{expiresIn: '7d'});
 
    const hashedRefreshToken = bcrypt.hashSync(refreshToken,10);
 
    await prisma.refreshToken.upsert({
     where: {UserId : user.userId},
     update:{
       refresh_token:hashedRefreshToken,
     },
     create:{
       UserId : user.userId,
       refresh_token:hashedRefreshToken,
     }
   })
   
   
     
 
   return res.status(200).json({
   status: 200,
   message: '토큰 재발급에 성공했습니다.',
   data:{accessToken: accessToken, refreshToken: refreshToken},
     });
  }catch(err){
   next(err);  
 }
 
 })
 

//내 정보 조회 API
router.get('/users', authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.user;

    const user = await prisma.users.findFirst({
      where: { userId: +userId },
      select: {
        userId: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(HTTP_STATUS.OK).json({status:HTTP_STATUS.OK, data: user });
  } catch (err) {
    next(err);
  }
});






export default router;


