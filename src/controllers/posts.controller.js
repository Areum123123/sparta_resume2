import { PostsService } from "../services/posts.service.js";
import { HTTP_STATUS } from "../constants/http-status.constant.js";
import {prisma} from "../utils/prisma.util.js"

export class PostsController{
    postsService = new PostsService();


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


  createPost = async(req, res, next)=>{
    try{
        //1.게시글을 작성하려는 클라이언트가 로그인된 사용자인지 검증
    const {userId} = req.user;
    //2.게시글 생성을 위한 'title','content'를 body로 전달 받는다.
    const {title, content} = req.body;
    const createdPost = await this.postsService.createdPost(userId, title, content)
    
    return res.status(201).json({data: createdPost});
    }catch(err){
        next(err);
    }
    
    
    }

}