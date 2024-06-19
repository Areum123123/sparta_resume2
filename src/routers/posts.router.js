import express from 'express';
import { prisma } from '../utils/prisma.util.js';
import  authMiddleware  from "../middlewares/auth.middleware.js"

const postsRouter = express.Router();

//게시글 생성 API
postsRouter.post('/',authMiddleware, async(req, res, next)=>{
try{
    //1.게시글을 작성하려는 클라이언트가 로그인된 사용자인지 검증
const {userId} = req.user;
//2.게시글 생성을 위한 'title','content'를 body로 전달 받는다.
const {title, content} = req.body;
//3.유효성 검사
if (!title || !content) {
  return res.status(400).json({ status:400, message: '제목과 내용을 입력해 주세요.' });
}

if(content.length < 100){
  return res.status(400).json({status:400, message: '게시내용을 100자이상 입력해 주세요.' });
}

//4.posts테이블에 게시글을 생성합니다.
const post = await prisma.posts.create({
    data:{
       UserId : userId,
        title,
        content,

    }
})
return res.status(201).json({data: post});
}catch(err){
    next(err);
}


})


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
      // userId와 postId를 req.params에서 받기
      const { postId } = req.params;
  
      // 추천지역, 추천이유, 사진을 req.body에서 받기
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
  
      // 게시글 삭제하기
      await prisma.posts.delete({
        where: {
          postId: +postId,
        },
      });
  
      return res
        .status(200)
        .json({ message: "게시글이 삭제되었습니다.", data: postId });
    } catch (error) {
      next(error);
    }
  });


export default postsRouter;
