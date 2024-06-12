import { UsersRepository } from "../repositories/users.repository.js";

export class UsersController{
  usersRepository = new UsersRepository();

    //내정보 조회 API
    getUser = async(req, res, next) =>{
      try{
        const { userId } = req.user;
       const user = await this.usersRepository.findUser(userId);
       
       return res.status(200).json({data: user});
      } catch(err){
        next(err);
      }
    }
}

