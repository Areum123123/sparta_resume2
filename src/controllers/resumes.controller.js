import { ResumesService } from "../services/resumes.sevice.js";

export class ResumesController{
  resumesService = new ResumesService();
 
// 이력서 생성 API
 createResume = async(req, res, next) =>{
   
    try{
       const { title, introduction } = req.body;
       const {userId} = req.user;
        
        const createdResume = await this.resumesService.createResume(
          userId, title, introduction 
        );

        return res.status(201).json({data : createdResume})

    } catch(err){
      next(err);
     }
    };
//이력서 목록 조회 API //recruiter만 다 조회 가능
getResumes = async(req, res, next) =>{
      
  try{
    const { userId, role } = req.user;
    const { sort, status } = req.query; //정렬기준받기

    const resumes = await this.resumesService.findAllResumes(userId, role, sort, status);

    return res.status(200).json({data: resumes})

  }catch(err){
  next(err);  
 }
 };

 //id로 이력서 찾기
 getResumeById = async(req, res, next)=>{
 try{
  const { userId, role } = req.user;
  const { resumeid } = req.params;

  const resume = await this.resumesService.findResumeById(userId, role, resumeid);

  if (!resume) {
    return res.status(404).json({ status: 404, message: '이력서가 존재하지 않습니다.' });
  }

  return res.status(200).json({ data: resume });
 }catch(err){
  next(err);
  }
 }
//이력서수정
 updateResume = async(req, res, next) =>{
  try{
    const { userId } = req.user;
    const { resumeid } = req.params;
    const { title, introduction } = req.body;
      
    const updatedResume = await this.resumesService.updateResume(userId, resumeid, title, introduction)

    return res.status(200).json({ data: updatedResume });
  }catch(err){
    next(err);
  }
 }
//이력서삭제
 deleteResume = async(req, res, next)=>{
  try{
  const { userId } = req.user;
  const { resumeid } = req.params;

  const deletedResume = await this.resumesService.deleteResume(resumeid,userId)

  return res.status(200).json({ data: deletedResume });
  }catch(err){
    if (err.message === '이력서가 존재하지 않습니다.') {
      return res
        .status(404)
        .json({ status:404, message: err.message });
    }
    next(err);
  }
 }

}