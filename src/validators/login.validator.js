import Joi from "joi";


const LoginSchema = Joi.object({
    email: Joi.string().email().required().messages({
      'any.required': '이메일을 입력해주세요',
      'string.email': '이메일 형식이 올바르지 않습니다.',
      'string.empty': '이메일을 입력해 주세요',
    }),
    password: Joi.string().required().messages({
      'any.required': '비밀번호를 입력해주세요',
      'string.empty': '비밀번호를 입력해주세요',
    }),
    
  });

export const LoginValidator = async (req, res, next) => {
  try {
    await LoginSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    res.status(400).json({ message: errorMessage });
  }
};