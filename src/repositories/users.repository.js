import { prisma } from "../utils/prisma.util.js"

export class UsersRepository {
    findUser = async(userId) =>{
     const user = await prisma.users.findUnique({
        where: {
            userId: +userId,
          },
          select: {
            userId: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
     });
        

     return user;
    }
}