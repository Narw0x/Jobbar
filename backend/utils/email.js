import nodeamiler from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";
import emailRegistration from "./emailRegistration.js";

export default async function sendEmail(options){
    const transporter = nodeamiler.createTransport(smtpTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        tls: {
            rejectUnauthorized: false,
        },
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    }));
    
    const message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: emailRegistration(options),
    };
    
    await transporter.sendMail(message);
};
