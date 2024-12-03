import { ResetPasswordEmailTemplate } from "./emailTemplates.js";
import getErrorDetails from "../Utilites/errorCodes.js";
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const SendPasswordResetEmail = async (username, email, clientURL) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const LogoPath = path.join(__dirname, '../public/Images/Logo.png');
    const ResetPasswordEmailTemplatePath = path.join(__dirname, '../public/Images/ResetPasswordTemplate.png');

    const mailDetails = {
      to: email,
      subject: 'Your Verification Code',
      html: ResetPasswordEmailTemplate.replace("{Username}", username ?? "Error getting Username!").replace("{ResetLink}", clientURL),
      attachments: [{
        filename: 'Logo.png',
        path: LogoPath,
        cid: '../public/Images/Logo.png' 
    }, {
        filename: 'ResetPasswordTemplate.png',
        path: ResetPasswordEmailTemplatePath,
        cid: '../public/Images/ResetPasswordTemplate.png' 
    }]
    };

    await transporter.sendMail(mailDetails);
  } catch (error) {
    const code = getErrorDetails('INTERNAL_SERVER_ERROR', `(Sending Password Reset Link) ${error}`)
    console.error(code);
  }
};

export default SendPasswordResetEmail;