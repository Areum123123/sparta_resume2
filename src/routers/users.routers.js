import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { requireRefreshToken } from '../middlewares/require-refresh-token.middleware.js';
import { UsersController } from '../controllers/users.controller.js';
const UsersRouter = express.Router();

//내 정보 조회 API

const usersController = new UsersController(); // UsersController 인스터화 시킨다.

UsersRouter.get('/users',authMiddleware, usersController.getUser);



export default UsersRouter;


