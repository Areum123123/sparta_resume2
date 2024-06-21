import { v4 as uuidv4 } from 'uuid';
import { sendVerificationEmail } from '../utils/email.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthRepository } from "../repositories/auth.repository.js" 
import {ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY} from "../constants/env.constant.js"
import {prisma} from '../utils/prisma.util.js'

export class AuthService{

  authRepository = new AuthRepository();
    
    //회원가입
    register = async (email, password, name) => {
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
      
    const registered = await this.authRepository.register(email, hashedPassword, name);
        
    
        return { message: '회원가입이 완료되었습니다.',data:`아이디:${registered.userId }` };
      } catch (err) {
        throw err;
      }
    };
 


    //로그인
login = async(email, password)=>{
  try {
      const user = await this.authRepository.findUserByEmail(email);
      
      if (!user) {
          throw new Error('사용자가 존재하지 않습니다.');
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      throw new Error('비밀번호가 일치하지 않습니다.');
      }
  

      // accessToken 토큰 생성
      const accessToken = jwt.sign(
        { userId: user.userId },
        ACCESS_TOKEN_SECRET_KEY,
        { expiresIn: '12h' }
      );


        //refresh토큰  발급
      const refreshToken = jwt.sign(
  {
    userId : user.userId,
  },REFRESH_TOKEN_SECRET_KEY,{expiresIn: '7d'});


  const hashedRefreshToken = bcrypt.hashSync(refreshToken, 10);

    // refreshToken을 데이터베이스에 저장
  await prisma.refreshToken.upsert({
    where: { UserId: user.userId },
    update: {
      refresh_token: hashedRefreshToken,
    },
    create: {
      UserId: user.userId,
      refresh_token: hashedRefreshToken,
    }
  });


    
        return { accessToken, refreshToken };
      } catch (err) {
        throw err;
      }
    };



  //access토큰 refresh토큰 재발급

  generateTokens = async(user) =>{
    const payload = { userId: user.userId };
  // Access Token 생성
  const accessToken = jwt.sign(
    payload,
    ACCESS_TOKEN_SECRET_KEY,
    { expiresIn: '12h' }
  );
  
  // Refresh Token 발급
  const refreshToken = jwt.sign(
    payload,
    REFRESH_TOKEN_SECRET_KEY,
    { expiresIn: '7d' }
  );
  
  const hashedRefreshToken = bcrypt.hashSync(refreshToken, 10);
  
  await this.authRepository.upsertRefreshToken(user.userId, hashedRefreshToken);
  return {accessToken, refreshToken}
  
  }
        
    }

