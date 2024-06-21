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

 // 이메일 인증 토큰으로 사용자 찾기
findByVerificationToken = async (token) => {
  return await prisma.users.findUnique({
    where: {
      emailVerificationToken: token
    }
  });
}

// 이메일 인증 완료 처리
verifyEmail = async (userId) => {
  await prisma.users.update({
    where: {
      userId: userId
    },
    data: {
      emailVerified: true,
      emailVerificationToken: null
    }
  });
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
      refresh_token :null,
    }
  })
 }

 upsertRefreshToken = async(userId, hashedRefreshToken)=>{
  await prisma.refreshToken.upsert({
  where: { UserId: userId},
  update: {
    refresh_token: hashedRefreshToken,
  },
  create: {
    UserId: userId,
    refresh_token: hashedRefreshToken,
  }
});
 }
 

}
