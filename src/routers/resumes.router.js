import express from 'express';
import { prisma } from '../utils/prisma.util.js';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { requireRoles } from '../middlewares/require-roles.middleware.js';
import {ResumesController}  from '../controllers/resumes.controller.js';;


const resumesRouter = express.Router();


// 인스턴스 생성
const resumesController = new ResumesController(); //ResumesController 인스턴스화 시킨다.
/* 이력서 생성 API */
 resumesRouter.post('/', resumesController.createResume);
 // resumesRouter.post('/', async (req, res, next) => {
//   const { userId } = req.user;
//   const { title, introduction } = req.body;
//   //제목,자기소개입력
//   if (!title || !introduction) {
//     const missingFields = [];
//     if (!title) {
//       missingFields.push('제목');
//     }
//     if (!introduction) {
//       missingFields.push('자기소개');
//     }
//     return res
//       .status(HTTP_STATUS.BAD_REQUEST)
//       .json({ status: HTTP_STATUS.BAD_REQUEST, message: `${missingFields}을(를) 입력해주세요.` });
//   }
//   //자기소개150자
//   if (introduction.length < 150) {
//     return res
//       .status(HTTP_STATUS.BAD_REQUEST)
//       .json({ status: HTTP_STATUS.BAD_REQUEST, message: '자기소개는 150자 이상 작성해야 합니다.' });
//   }
//   //이력서생성
//   try {
//     const resume = await prisma.resumes.create({
//       data: {
//         UserId: +userId,
//         title,
//         introduction,
//       },
//     });

//     return res.status(HTTP_STATUS.CREATE).json({ data: resume });
//   } catch (err) {
//     next(err);
//   }
// });

/*이력서 목록 조회 API(accessToken인증)*/
resumesRouter.get('/',  async (req, res, next) => {
  const { userId, role } = req.user;
  const { sort, status } = req.query; //정렬기준받기
  const orderBy = sort && sort.toLowerCase() === 'asc' ? 'asc' : 'desc';

  
    const whereCondition = {};
    if (role !== 'RECRUITER') {
      whereCondition.UserId = userId; // RECRUITER가 아니면 본인 이력서만 조회
    }
    if (status) {
      whereCondition.status = status; // 지원 상태 필터링
    }

  //이력서조회
  try {
    const resumes = await prisma.resumes.findMany({
      where: whereCondition,
      orderBy: { createdAt: orderBy },
      include: {
        User: {
          select: { name: true },
        },
      },
    });

    const result = resumes.map((resume) => ({
      resumeId: resume.resumeId,
      name: resume.User.name,
      title: resume.title,
      introduction: resume.introduction,
      status: resume.status,
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt,
    }));

    if (!resumes.length) {
      return res.status(HTTP_STATUS.OK).json([]);
    }

    return res.status(HTTP_STATUS.OK).json({ data: result });
  } catch (err) {
    next(err);
  }
});

/* 이력서 상세 조회 API */
resumesRouter.get('/:resumeid', async (req, res, next) => {
  const { userId, role } = req.user;
  const { resumeid } = req.params;
  
  try {
    const resume = role === 'APPLICANT'?
     await prisma.resumes.findFirst({
      where: {
        resumeId: +resumeid,
        UserId: userId,
      },
      include: {
        User: {
          select: { name: true },
        },
      },
    })
    :await prisma.resumes.findFirst({
      where: {
        resumeId: +resumeid,
      },
      include: {
        User: {
          select: { name: true },
        },
      },
    })

    if (!resume) {
      return res
        .status(HTTP_STATUS.NOTFOUND)
        .json({ status: HTTP_STATUS.NOTFOUND, message: '이력서가 존재하지 않습니다.' });
    }

    const result = {
      resumeId: resume.resumeId,
      name: resume.User.name,
      title: resume.title,
      introduction: resume.introduction,
      status: resume.status,
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt,
    };

    return res.status(HTTP_STATUS.OK).json({ data: result });
  } catch (err) {
    next(err);
  }
});

//이력서 수정 API
resumesRouter.patch('/:resumeid', async (req, res, next) => {
  const { userId } = req.user;
  const { resumeid } = req.params;
  const { title, introduction } = req.body;

  try {
    if (!title && !introduction) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ status: HTTP_STATUS.BAD_REQUEST, message: '수정 할 정보를 입력해 주세요.' });
    }

    if (introduction && introduction.length < 150) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({
          status: HTTP_STATUS.BAD_REQUEST,
          message: '자기소개는 150자 이상 작성해야 합니다.',
        });
    }

    const resume = await prisma.resumes.findFirst({
      where: {
        resumeId: +resumeid,
        UserId: userId,
      },
    });

    if (!resume) {
      return res
        .status(HTTP_STATUS.NOTFOUND)
        .json({ status: HTTP_STATUS.NOTFOUND, message: '이력서가 존재하지 않습니다.' });
    }

    //정보수정
    const updatedResume = await prisma.resumes.update({
      where: {
        resumeId: +resumeid,
        UserId: userId,
      },
      data: {
        title: title || resume.title,
        introduction: introduction || resume.introduction,
      },
    });

    const result = {
      resumeId: updatedResume.resumeId,
      UserId: updatedResume.UserId,
      title: updatedResume.title,
      introduction: updatedResume.introduction,
      status: updatedResume.status,
      createdAt: updatedResume.createdAt,
      updatedAt: updatedResume.updatedAt,
    };
    return res.status(HTTP_STATUS.OK).json({ data: result });
  } catch (err) {
    next(err);
  }
});

//이력서 삭제 API
resumesRouter.delete('/:resumeid', async (req, res, next) => {
  const { userId } = req.user;
  const { resumeid } = req.params;

  try {
    const resume = await prisma.resumes.findFirst({
      where: {
        resumeId: +resumeid,
        UserId: userId,
      },
    });

    if (!resume) {
      return res
        .status(HTTP_STATUS.NOTFOUND)
        .json({ status: HTTP_STATUS.NOTFOUND, message: '이력서가 존재하지 않습니다.' });
    }

    //이력서 삭제
    await prisma.resumes.delete({
      where: {
        resumeId: +resumeid,
        UserId: userId,
      },
    });
    return res
      .status(HTTP_STATUS.OK)
      .json({
        status: HTTP_STATUS.OK,
        message: `이력서(RESUMEID: ${resumeid})가 성공적으로 삭제되었습니다.`,
      });
  } catch (err) {
    next(err);
  }
});

//이력서 지원 상태 변경 api(미들웨어 require-roles.middleware.js)/api/resumes/:resumeid/status
resumesRouter.patch('/:resumeid/status', requireRoles(['RECRUITER']),async(req, res, next)=>{
  try{
  const data =null;
  return res.status(HTTP_STATUS.OK).json({
    status:HTTP_STATUS.OK,
    message:"이력서 지원 상태 변경에 성공했습니다.",
    data,
  })

  }catch(err){
    next(err)
  }
})



export default resumesRouter;