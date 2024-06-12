import { ResumesService } from "../services/resumes.sevice.js";
export class ResumesController{
   
// 이력서 생성 API
 createResume = async(req, res, next) =>{
   resumesService = new ResumesService();

    try{
        const { userId } = req.user;
        const { title, introduction } = req.body;
        const createdResume = await this.resumesService.createResume(
          userId, title, introduction 
        );

        return res.status(201).json({data : createdResume})

    } catch(err){
      next(err);
    }


 }
}