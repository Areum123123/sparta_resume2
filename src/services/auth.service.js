import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthRepository } from "../repositories/auth.repository.js" 
import {ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY} from "../constants/env.constant.js"

export class AuthService{
    authRepository = new AuthRepository();
    
    //회원가입
    register =async(  email, password, name  ) => {

    const hashedPassword = await bcrypt.hash(password, 10);
     const registered = await this.authRepository.register( email, hashedPassword, name );

       delete registered.password;
        return registered;   
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
  
  

        
            return { accessToken, refreshToken };
          } catch (err) {
            throw err;
          }
        };


    }

