
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
        
  
        return { message: '회원 가입 요청이 성공적으로 처리되었습니다. 이메일을 확인해주세요.' };
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

  verifyEmail = async (verificationCode, email) => {
    try {
      const record = await this.authRepository.findLatestEmailRecord(email);
      if (!record || record.verificationCode !== parseInt(verificationCode, 10)) {
        return { status: 400, message: '인증번호가 일치하지 않습니다.' };
      }

      const tempUser = await this.authRepository.findTempUserByEmail(email);
      if (!tempUser) {
        return { status: 400, message: '가입 요청을 찾을 수 없습니다.' };
      }

      const user = await this.authRepository.createUser(tempUser);

      await this.authRepository.deleteTempUser(email);
      await this.authRepository.deleteEmailRecords(email);

      return { status: 200, message: '이메일이 성공적으로 인증되었습니다.' };
    } catch (error) {
      console.error("Error:", error);
      return { status: 500, message: '이메일 인증 중 오류가 발생했습니다.' };
    }
  };
  // verifyEmail = async(verificationCode, email) => {
     
  //    const record = await this.authRepository.findLatestEmailRecord(email);
    
  //   try {
   
  //     if (!record || record.verificationCode !== parseInt(verificationCode, 10)) {
  //       return res.status(400).json({ message: '인증번호가 일치하지 않습니다.' });
  //     }
  
  //     const tempUser = await this.authRepository.findTempUserByEmail(email);
  
  //     if (!tempUser) {
  //       return res.status(400).json({ message: '가입 요청을 찾을 수 없습니다.' });
  //     }
  
  //     const user= await this.authRepository.createUser(tempUser);
      
  //     await this.authRepository.deleteTempUser(email);
  //     await this.authRepository.deleteEmailRecords(email);
  
  //     res.status(200).json({ message: '이메일이 성공적으로 인증되었습니다.' });
  //   } catch (error) {
  //     console.error("Error:", error);
  //     res.status(500).json({ message: '이메일 인증 중 오류가 발생했습니다.' });
  //   }
  // }

  deleteUser = async(userId)=>{
    await this.authRepository.deleteUser(userId);
  }
        
    }

