import Joi from "joi";

const updateResumeSchema = Joi.object({
  title: Joi.string().optional().messages({
    'string.empty': '제목을 입력해주세요.',
  }),
  introduction: Joi.string().min(150).optional().messages({
    'string.min': '자기소개는 150자 이상 작성해야 합니다.',
  }),
});

export const updateResumeValidator = async (req, res, next) => {
  try {
    await updateResumeSchema.validateAsync(req.body);
    next();
  } catch (error) {
    res.status(400).json({ status: 400, message: error.details[0].message });
  }
};
