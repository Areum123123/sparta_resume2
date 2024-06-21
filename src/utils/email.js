import nodemailer from 'nodemailer';
import { EMAIL_USER,EMAIL_PASS,FRONTEND_URL } from "../constants/env.constant.js"

const transporter = nodemailer.createTransport({
  service: 'Gmail', // 원하는 이메일 서비스 제공자
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

export const sendVerificationEmail = async (to, token) => {
  const url = `${FRONTEND_URL}/verify-email?token=${token}`;
  await transporter.sendMail({
    from: EMAIL_USER,
    to,
    subject: 'Email Verification',
    html: `Please click this link to verify your email: <a href="${url}">${url}</a>`
  });
};
