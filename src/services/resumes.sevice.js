import { ResumesRepository } from "../repositories/resumes.repository.js" 


export class ResumesService{
    resumesRepository = new ResumesRepository();
    
    //이력서생성
    createResume =async( userId ,title, introduction ) => {
    
        const createdResume = await this.resumesRepository.createResume(userId, title, introduction);

        return {
              resumeId: createdResume.resumeId,
              userId : createdResume.UserId, //
              title: createdResume.title,
              introduction : createdResume.introduction,
              status : createdResume.status,
              createdAt :createdResume.createdAt,
              updatedAt : createdResume.updatedAt,

        }
    };

    //이력서 목록 조회
    findAllResumes = async(userId, role, sort, status)=>{
        const orderBy = sort && sort.toLowerCase() === 'asc' ? 'asc' : 'desc';
        const whereCondition = {};
      
        if (role !== 'RECRUITER') {
          whereCondition.UserId = userId;
        }
        if (status) {
          whereCondition.status = status;
        }
      
     const resumes = await this.resumesRepository.getAllResumes(whereCondition, orderBy)

     return resumes.map((resume) => ({
        resumeId: resume.resumeId,
        name: resume.User.name,
        title: resume.title,
        introduction: resume.introduction,
        status: resume.status,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt,
      }));
    }

//이력서 상세 조회

findResumeById = async(userId, role, resumeid) =>{
    if (role === 'APPLICANT') {
        return await this.resumesRepository.findResumeByIdAndUserId(resumeid, userId);
      } else {
        return await this.resumesRepository.findResumeById(resumeid);
      }
   };


//이력서 수정
updateResume = async(userId, resumeid, title, introduction) => {
    const resume = await this.resumesRepository.findResumeByIdAndUserId(resumeid, userId);

    if (!resume) {
      throw new Error('이력서가 존재하지 않습니다.');
    }

    const updatedResume = await this.resumesRepository.updateResume(
      resumeid,
      userId,
      title || resume.title,
      introduction || resume.introduction
    );

    return {
      resumeId: updatedResume.resumeId,
      UserId: updatedResume.UserId,
      title: updatedResume.title,
      introduction: updatedResume.introduction,
      status: updatedResume.status,
      createdAt: updatedResume.createdAt,
      updatedAt: updatedResume.updatedAt,
    };
}

//이력서 삭제
deleteResume = async(resumeid,userId)=>{
   
 try{

    const resume = await this.resumesRepository.findResumeByIdAndUserId(resumeid,userId);
    if (!resume) {
        throw new Error('이력서가 존재하지 않습니다.');
      }

      await this.resumesRepository.deleteResume(resumeid,userId);
     
 }catch(err){
    next(err);
 }

}

}