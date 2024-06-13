import Joi from "joi";

const resumeSchema = Joi.object({
    title: Joi.string().required().messages({
      'any.required': '제목을 입력해주세요.',
      'string.empty': '제목을 입력해주세요.',
    }),
    introduction: Joi.string().min(150).required().messages({
      'any.required': '자기소개를 입력해주세요.',
      'string.empty': '자기소개를 입력해주세요.',
      'string.min': '자기소개는 150자 이상 작성해야 합니다.',
    }),
  });
  
  export const ResumeValidator = async (req, res, next) => {
    try {
      await resumeSchema.validateAsync(req.body);
      next();
    } catch (error) {
      res.status(400).json({ status: 400, message: error.details[0].message });
    }
  };