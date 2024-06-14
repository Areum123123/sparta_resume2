import {prisma} from '../utils/prisma.util.js'

export class AuthRepository {
 register = async(email, hashedPassword, name ) =>{
   const registered = await prisma.users.create({
    
     data : {
        email,
        name,
        password: hashedPassword,

     } 
   })
   return registered;
 }

 findUserByEmail = async(email)=>{

     const user = await prisma.users.findFirst({
        where: { email },
        select: {
            userId: true,
            email: true,
            role: true,
            name: true,
            password: true, 
            createdAt: true,
            updatedAt: true,
          },
        
      });
  
      return user;
 }
    
 logout = async(userId)=>{
   await prisma.refreshToken.update({
    where:{UserId:+userId},
    data:{
      refreshToken :null,
    }
  })
 }
}
