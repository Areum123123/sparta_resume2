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


 }
}