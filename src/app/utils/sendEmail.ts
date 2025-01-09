import nodemailer from 'nodemailer';
import { ApiError } from './ApiError';

export const sendMail = async (sender: string, receiver: string, subject: string, body: string) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user: process.env.EMAIL, 
            pass: process.env.EMAIL_PASSWORD
        }
    });


    const mailOptions = {
        from: sender,
        to: receiver,
        subject: subject,
        text: body
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email', error);
        throw new ApiError(500, "Error sending email");
    }

}