import nodemailer from 'nodemailer';
import { EMAIL_USER,EMAIL_PASS,FRONTEND_URL } from "../constants/env.constant.js"



const transporter = nodemailer.createTransport({
  service: 'Gmail', // 원하는 이메일 서비스 제공자
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  },
  secure: true, // SSL 사용 설정
  port: 465
});

export const sendVerificationEmail = async (to, verificationCode) => {

  await transporter.sendMail({
    from: EMAIL_USER,
    to,
    subject: '이메일 인증',
    html: ` <h1>이메일 인증 코드</h1>
            <p>아래의 인증 코드를 입력하여 이메일을 인증해주세요:</p>
            <p><strong>${verificationCode}</strong></p>`
  });


};
