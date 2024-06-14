import express from 'express';
import {ResumesController}  from '../controllers/resumes.controller.js';
import { ResumeValidator } from '../validators/resume.validator.js'; 
import { updateResumeValidator } from '../validators/updateResume.validator.js';


const resumesRouter = express.Router();


// 인스턴스 생성
const resumesController = new ResumesController();

/* 이력서 생성 API */
resumesRouter.post('/', ResumeValidator, resumesController.createResume);

/*이력서 목록 조회 API(accessToken인증)*/
resumesRouter.get('/', resumesController.getResumes);

/* 이력서 상세 조회 API */
resumesRouter.get('/:resumeid', resumesController.getResumeById);

//이력서 수정 API
resumesRouter.patch('/:resumeid',updateResumeValidator, resumesController.updateResume);

//이력서 삭제 API
resumesRouter.delete('/:resumeid', resumesController.deleteResume);


export default resumesRouter;
