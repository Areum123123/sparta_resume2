import { PostsRepository } from "../repositories/posts.repository.js" 
import {prisma} from "../utils/prisma.util.js"


export class PostsService{
    postsRepository = new PostsRepository();
    
    
    //게시물생성
 createdPost = async(userId, title, content)=>{

     //3.유효성 검사
     if (!title || !content) {
        return res.status(400).json({ status:400, message: '제목과 내용을 입력해 주세요.' });
      }
      
      if(content.length < 100){
        return res.status(400).json({status:400, message: '게시내용을 100자이상 입력해 주세요.' });
      }
      
      const post = await this.postsRepository.createdPost( userId, title, content);
   
      return post;
 }

}