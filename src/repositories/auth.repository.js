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

     // 이메일로 사용자 조회
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
    
}
