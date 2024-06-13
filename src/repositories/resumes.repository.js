import {prisma} from '../utils/prisma.util.js'

export class ResumesRepository {
 createResume = async(userId, title, introduction) =>{
   const createdResume = await prisma.resumes.create({
     data : {
       
        userId : +userId,
        title, 
        introduction,

     } 
   })
   return createdResume;
 }
    
}


