import express from "express";
import {authRouter}   from "./auth.router.js";
import resumesRouter  from "./resumes.router.js"
import  authMiddleware  from "../middlewares/auth.middleware.js"
import postsRouter from "./posts.router.js";

const apiRouter = express.Router();

apiRouter.use('/auth', authRouter)
apiRouter.use('/resumes',authMiddleware ,resumesRouter);
apiRouter.use('/posts', postsRouter)


export default apiRouter
