import {prisma} from '../utils/prisma.util.js'
import sendEmail from '../utils/email.js';

export class AuthRepository {
 register = async(email, hashedPassword, name ) =>{


// 인증 코드를 이메일로 전송
await sendEmail(email);

// 임시 사용자 데이터를 저장 (이메일 인증 후 최종 저장)
const registered = await prisma.tempUsers.create({
  data: {
    email,
    password: hashedPassword,
    name,
  },
});

return registered

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
 

  findLatestEmailRecord = async (email) => {
  return await prisma.email.findFirst({
    where: { email },
    orderBy: { createdAt: 'desc' },
  });
};

findTempUserByEmail = async (email) => {
  return await prisma.tempUsers.findFirst({
    where: { email },
    orderBy: { createdAt: 'desc' },
  });
};

createUser = async (tempUser) => {
  return await prisma.users.create({
    data: {
      email: tempUser.email,
      password: tempUser.password,
      name: tempUser.name,
    },
  });
};

deleteTempUser = async (email) => {
  return await prisma.tempUsers.delete({
    where: { email },
  });
};

deleteEmailRecords = async (email) => {
  return await prisma.email.deleteMany({
    where: { email },
  });
};


deleteUser = async(userId) => {
  await prisma.users.delete({
    where: {
      userId: userId,
    },
  });
}
}
