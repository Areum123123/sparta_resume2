import { ResumesRepository } from "../repositories/resumes.repository.js" 


export class ResumesService{
    resumesRepository = new ResumesRepository();
    //이력서생성
    
    createResume =async( userId ,title, introduction ) => {
    
        const createdResume = await this.resumesRepository.createResume(userId, title, introduction);

        return {
              resumeId: createdResume.resumeId,
              userId : createdResume.userId, //안되면 createdResume 붙이기
              title: createdResume.title,
              introduction : createdResume.introduction,
              status : createdResume.status,
              createdAt :createdResume.createdAt,
              updatedAt : createdResume.updatedAt,

        }
   

    }

}