import { AuthService } from "../services/auth.service.js";
import { HTTP_STATUS } from "../constants/http-status.constant.js";


export class AuthController{
    authService = new AuthService();
//회원가입
    register = async(req, res,next)=>{
      try{
        const { email, password, name } = req.body;
        const registered = await this.authService.register(email, password, name );
    
     return res.status(HTTP_STATUS.CREATE).json({data : registered});
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

        return res.status(HTTP_STATUS.OK).json({ accessToken, refreshToken });
  }catch(err){
    next(err)
  }
    }
//refreshToken재발급
  refreshToken = async (req, res, next) => {
    try {
      const user = req.user; // 미들웨어 인증받은 user
 
       const tokens = await this.authService.generateTokens(user);

      return res.status(200).json({
        status: 200,
        message: '토큰 재발급에 성공했습니다.',
        data: { tokens },
      });
    } catch (err) {
      next(err);
    }
  } 

}