import { AuthService } from "../services/auth.service.js";

export class AuthController{
    authService = new AuthService();
//회원가입
    register = async(req, res,next)=>{
      try{
        const { email, password, name } = req.body;
        const registered = await this.authService.register(email, password, name );

     return res.status(201).json({data : registered});
      }catch(err){
        next(err);
      }

    }
 //로그인
    login = async(req, res, next)=>{    
     try{
        const { email, password } = req.body;
        const { accessToken, refreshToken } = await this.authService.login(email, password);

        res.header('accessToken', accessToken);
        res.header('refreshToken', refreshToken);

        return res.status(200).json({ accessToken, refreshToken });
  }catch(err){
    next(err)
  }

    }

}