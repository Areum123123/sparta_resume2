import {prisma} from '../utils/prisma.util.js'

export class ResumesRepository {
 createResume = async(userId, title, introduction) =>{
   const createdResume = await prisma.resumes.create({
   data : {
    UserId: +userId,
    title,
    introduction,

     } 
   })
   return createdResume;
 }
 
 getAllResumes = async (whereCondition, orderBy) =>{
  return await prisma.resumes.findMany({
    where: whereCondition,
    orderBy: { createdAt: orderBy },
    include: {
      User: {
        select: { name: true },
      },
    },
  });
 }

 //role이 applicant의 상세조회 본인것만
 findResumeByIdAndUserId = async(resumeid, userId) =>{
  return await prisma.resumes.findFirst({
    where: {
      resumeId: +resumeid,
      UserId: userId,
    },
    include: {
      User: {
        select: { name: true },
      },
    },
  });
 }

 //role이 recruiter의 상세조회
 findResumeById = async(resumeid) =>{
  return await prisma.resumes.findFirst({
    where: {
      resumeId: +resumeid,
    },
    include: {
      User: {
        select: { name: true },
      },
    },
  });
}

updateResume = async(resumeid, userId, title, introduction) => {
  return await prisma.resumes.update({
    where: {
       resumeId: +resumeid, 
       UserId: +userId 
    },
    data: {
      title,
      introduction,
    },
   });
  }

  deleteResume = async (resumeid,userId) => {
    await prisma.resumes.delete({
      where: {
        resumeId: +resumeid,
        UserId: +userId,
      },
    });
  }; 
 }
    



