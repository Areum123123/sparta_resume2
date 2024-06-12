export class ResumesRepository {
 createResume = async(userId, title, introduction) =>{
   const createdResume = await prisma.resumes.create({
     data : {userId, title, introduction,

     } 
   })
   return createdResume;
 }
    
}


