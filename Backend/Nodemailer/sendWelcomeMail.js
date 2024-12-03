import { WelcomeEmailTemplate } from "./emailTemplates.js";
import getErrorDetails from "../Utilites/errorCodes.js";
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const SendWelcomeMail = async (email, userName) => {
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
    const WelcomeEmailTemplatePath = path.join(__dirname, '../public/Images/WelcomeTemplate.png');

    const mailDetails = {
      to: email,
      subject: 'Your Verification Code',
      html: WelcomeEmailTemplate.replace("{Username}", userName ?? "Error getting Username!"),
      attachments: [{
        filename: 'Logo.png',
        path: LogoPath,
        cid: '../public/Images/Logo.png'
      }, {
        filename: 'WelcomeTemplate.png',
        path: WelcomeEmailTemplatePath,
        cid: '../public/Images/WelcomeTemplate.png'
      }]
    };

    await transporter.sendMail(mailDetails);
  } catch (error) {
    const code = getErrorDetails('INTERNAL_SERVER_ERROR', `(Welcome Email) ${error}`)
    console.error(code);
  }
};

export default SendWelcomeMail;