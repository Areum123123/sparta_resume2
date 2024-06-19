import { UsersRepository } from "../repositories/users.repository.js";
import { HTTP_STATUS } from "../constants/http-status.constant.js";
import { MESSAGES } from "../constants/message.constant.js";


export class UsersController {
  constructor() {
    this.usersRepository = new UsersRepository();
  }

  // 내 정보 조회 API
  getUser = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const user = await this.usersRepository.findUser(userId);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.USERS.READ_ME.SUCCEED,
        data: user
      });
    } catch (err) {
      next(err);
    }
  }

  
}
