import express from 'express';
import { prisma } from '../utils/prisma.util.js';
import  authMiddleware  from "../middlewares/auth.middleware.js"

const commentsRouter = express.Router();

//댓글생성 API
commentsRouter.post('/:postId/comments', authMiddleware, async(req, res, next)=>{
//1.댓글을 작성하려는 클라이언트가 로그인된 사용자인지 검증합니다.
 const {userId} = req.user;
//2.게시물을 특정하기 위한 postId를 Path parameters로 전달 받습니다.
 const {postId} = req.params;
//3.댓글 생성을 위한 content 를 body로 전달 받습니다.
 const {content} = req.body;


const post = await prisma.posts.findFirst({ where: {postId : +postId}}) //게시물중 postId와 내가 받은 postId가 같다는 조건
if(!post){
    return res.status(404).json({status:404, message: "게시물이 존재하지 않습니다"});
}
//4.comments테이블에 댓글을 생성합니다.
 const comment = await prisma.comments.create({
  data:{
    content,
    UserId: userId,
    PostId: +postId,
  }
 });
 return res.status(200).json({data: comment})
})


//댓글조회API
commentsRouter.get('/:postId/comments', async(req, res, next)=>{
 const {postId} = req.params;

 const post = await prisma.posts.findFirst({
    where:{postId : +postId}
 });

 if(!post){
    return res.status(404).json({status :404, message:"게시글이 존재하지 않습니다."})
 }

 const comments = await prisma.comments.findMany({
    where:{PostId: +postId},
    orderBy:{createdAt: 'desc'},
 })

  return res.status(200).json({status:200, data:comments})

})

//댓글 수정 API
commentsRouter.put("/:postId/comments/:commentId", authMiddleware, async (req, res, next) => {
    try {

      const {userId} = req.user
      // userId와 postId를 req.params에서 받기
      const { postId, commentId } = req.params;
  
      const {content } = req.body;
  
      // 입력값이 하나도 없는 경우
      if (!content) {
        return res.status(400).json({ message: "수정 할 정보를 입력해주세요." });
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

      // 댓글 조회
      const existComment = await prisma.comments.findUnique({
        where: {
                PostId: +postId,
                commentId: +commentId,
            },
    });

     // 댓글이 없는 경우
      if (!existComment) {
        return res.status(404).json({ message: "해당 댓글을 찾을 수 없습니다." });
      }

      // 댓글의 작성자와 요청을 보낸 사용자의 ID 비교
      if (existComment.UserId !== userId) {
        return res.status(403).json({ message: "댓글을 수정할 권한이 없습니다." });
    }
     
      // 수정한 내용 반영하기
      const updateComment = await prisma.comments.update({
        where: {
          PostId: +postId,
          commentId : +commentId,
        },
        data: {
          content,
          updatedAt: new Date(),
        },
      });
  
      return res
        .status(200)
        .json({ message: "댓글 수정이 완료되었습니다!", data: updateComment });
    } catch (error) {
      next(error);
    }
  });
  
  

//댓글 삭제 API
commentsRouter.delete("/:postId/comments/:commentId", authMiddleware, async (req, res, next) => {
    try {
      // userId를 req.posts에서 받기- user로 해도 됩니다.
      const { userId } = req.user;
  
      // postId를 req.params에서 받기
      const { postId, commentId } = req.params;
  
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


      // 댓글 조회
      const existComment = await prisma.comments.findUnique({
        where: {
                PostId: +postId,
                commentId: +commentId,
            },
    });

     // 댓글이 없는 경우
      if (!existComment) {
        return res.status(404).json({ message: "해당 댓글을 찾을 수 없습니다." });
      }

       // 댓글 작성자와 요청을 보낸 사용자의 ID 비교
       if (existComment.UserId !== userId) {
        return res.status(403).json({ message: "댓글을 삭제할 권한이 없습니다." });
    }
  
      // 댓글 삭제하기
      await prisma.comments.delete({
        where: {
          PostId: +postId,
          commentId: +commentId,

        },
      });
  
      return res
        .status(200)
        .json({ status:200, message: "댓글이 삭제되었습니다.", data: `댓글ID:${commentId}` });
    } catch (error) {
      next(error);
    }
  });
export default commentsRouter;
