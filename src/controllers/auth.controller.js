import { AuthService } from "../services/auth.service.js";
import { HTTP_STATUS } from "../constants/http-status.constant.js";



export class AuthController{
    authService = new AuthService();
//회원가입
    register = async(req, res,next)=>{
      try{
        const { email, password, name } = req.body;
        const registered = await this.authService.register(email, password, name );
    
     return res.status(HTTP_STATUS.CREATE).json({status: HTTP_STATUS.CREATE, data : registered});
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

// //이메일 인증 확인
// verifyEmail = async(req,res,next)=>{
//   try{
//     const { verificationCode, email } = req.body;
 
 
//      const verifyEmail = await this.authService.verifyEmail(verificationCode,email);
 
//      return res.status(HTTP_STATUS.OK).json({data: verifyEmail});
//   }catch(err){
//    next(err);
//   }
    
//    }
 //이메일인증
//   verifyEmail = async(req,res,next)=>{
//  try{
//    const { verificationCode } = req.body;
//     const {email} = req.params;

//     const verifyEmail = await this.authService.verifyEmail(verificationCode,email);

//     return res.status(HTTP_STATUS.OK).json({data: verifyEmail});
//  }catch(err){
//   next(err);
//  }
   
//   }
verifyEmail = async (req, res, next) => {
  try {
    const { verificationCode, email } = req.body;
    // const { email } = req.params;

    const result = await this.authService.verifyEmail(verificationCode, email);

    return res.status(result.status).json({ message: result.message });
  } catch (err) {
    next(err);
  }
};


deleteUser = async (req, res, next) => {
  const userId = parseInt(req.params.userId);

  try {
    await this.authService.deleteUser(userId);
    
    return res.status(200).json({ message: '사용자가 성공적으로 탈퇴되었습니다.' });
  } catch (error) {
    console.error('사용자 삭제 중 오류 발생:', error);
    return res.status(500).json({ error: '사용자 삭제 중 오류가 발생했습니다.' });
  }
}
}