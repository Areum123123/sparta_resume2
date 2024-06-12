// import { UsersRepository } from "../repositories/users.repository.js"

// export class UsersService{
//   usersRepository = new UsersRepository();

//   //내정보조회
//     findUser = async() => {
     
//      const user = await this.usersRepository.findUser(userId);

//  return {
//     userId : user.userId,
//      email : user.email,
//      name : user.name,
//      role : user.role,
//      createdAt : user.createdAt,
//      updatedAt : user.updatedAt,
//  }


//   }
// }

// //user.sort((a,b)=> {return b.createdAt - a. createdAt }) 최신순 내림차순 정렬.
// // 내정보조회는 하나라 필요없음 . 게시물목록조회시 사용하삼.


// // {
// //   where: { userId: +userId },
// //   select: {
// //             userId: true,
// //             email: true,
// //             name: true,
// //             role: true,
// //             createdAt: true,
// //             updatedAt: true,
// //           },
// //  }