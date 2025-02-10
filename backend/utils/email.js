import nodeamiler from "nodemailer";
import emailRegistration from "./emailRegistration.js";

export default async function sendEmail(options){
    const transporter = nodeamiler.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    });
    
    const message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.htmlCode(options),
    };
    
    await transporter.sendMail(message);
};
