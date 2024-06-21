import {prisma} from '../utils/prisma.util.js'

export class PostsRepository {

    //게시물생성
    createdPost = async(userId, title, content) =>{
          const post = await prisma.posts.create({
          data:{
             UserId : userId,
              title,
              content,
      
          }
      })
           
        return post;
       }
}
 
    

