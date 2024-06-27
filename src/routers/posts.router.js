import express from 'express';
import { prisma } from '../utils/prisma.util.js';
import  authMiddleware  from "../middlewares/auth.middleware.js"
import { PostsController } from '../controllers/posts.controller.js';

const postsRouter = express.Router();

const postsController = new PostsController();

//게시글 생성 API
postsRouter.post('/',authMiddleware, postsController.createPost);


//게시글 목록 조회 API[누구나 목록을 볼 수 있음]

postsRouter.get('/', async(req, res, next)=>{
    try {
        const { sort = 'desc' } = req.query;
        const sortOrder = sort.toLowerCase() === 'asc' ? 'asc' : 'desc'; 
        let where = {};
    
      
        const posts = await prisma.posts.findMany({
          where,
          orderBy: { createdAt: sortOrder },
          select:  {
            UserId: true,
            postId: true,
            title: true,
            content: true,
            createdAt: true,
            updatedAt: true
          }
        });
        
      
    
        res.status(200).json({ data: posts });
      } catch (err) {
        next(err);
      }
    
})

//게시글 상세 조회(accesstoken)

postsRouter.get('/:postId', authMiddleware, async(req, res, next)=>{
try{
    const postId = parseInt(req.params.postId); 
    const post = await prisma.posts.findUnique({
        where: {
          postId: +postId
        },
        select: {
          UserId: true,
          postId: true,
          title: true,
          content: true,
          createdAt: true,
          updatedAt: true
        }
      });
  
    
  
      if (!post) {
        
        return res.status(404).json({ message: '게시글이 존재하지 않습니다.' });
      }
  
      res.status(200).json({ data: post });

}catch(err){
    next(err);
}

})

//게시글 수정API

postsRouter.patch("/:postId", authMiddleware, async (req, res, next) => {
    try {

      const { userId } = req.user;
      // userId와 postId를 req.params에서 받기
      const { postId } = req.params;
  
      // req.body에서 받기
      const { title, content } = req.body;
  
      // 입력값이 하나도 없는 경우
      if (!title && !content) {
        return res.status(400).json({ message: "수정 할 정보를 입력해주세요." });
      }
      
      if(content.length <100){
        return res.status(400).json({ message: "내용은 100자 이상 입력해주세요." });
      }
      // 수정할 게시글 조회하기
      const existPost = await prisma.posts.findFirst({
        where: {
          postId: +postId,
        }, 
      });
  
      // 게시글이 없는 경우
      if (!existPost) {
        return res.status(404).json({ message: "게시글이 존재하지 않습니다." });
      }

      // 게시글의 작성자와 요청을 보낸 사용자의 ID 비교
      if (existPost.UserId !== userId) {
        return res.status(403).json({ message: "게시글을 수정할 권한이 없습니다." });
    }
  
      // 수정한 내용 반영하기
      const updatePost = await prisma.posts.update({
        where: {
          postId: +postId,
        },
        data: {
          title,
          content,
          updatedAt: new Date(),
        },
      });
  
      return res
        .status(200)
        .json({ message: "게시글 수정이 완료되었습니다!", data: updatePost });
    } catch (error) {
      next(error);
    }
  });
  
  

//게시글 삭제 API
postsRouter.delete("/:postId", authMiddleware, async (req, res, next) => {
    try {
      // userId를 req.posts에서 받기- user로 해도 됩니다.
      const { userId } = req.user;
  
      // postId를 req.params에서 받기
      const { postId } = req.params;
  
      // 삭제할 게시글 조회하기
      const existPost = await prisma.posts.findFirst({
        where: {
          postId: +postId,
        },
      });
  
      // 게시글이 없는 경우
      if (!existPost) {
        return res.status(404).json({ message: "게시글이 존재하지 않습니다." });
      }
  
 // 게시글의 작성자와 현재 사용자가 일치하는지 확인
   if (existPost.UserId !== userId) {
  return res.status(403).json({ message: "게시글을 삭제할 권한이 없습니다." });
  }

      // 게시글 삭제하기
      await prisma.posts.delete({
        where: {
          postId: +postId,
        },
      });
  
      return res
        .status(200)
        .json({ message: "게시글이 삭제되었습니다.", data: `게시물ID:${postId}` });
    } catch (error) {
      next(error);
    }
  });



export default postsRouter;
