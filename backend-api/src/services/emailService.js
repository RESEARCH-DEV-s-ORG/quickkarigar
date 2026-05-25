const nodemailer = require('nodemailer');

const transporter =
    nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

const sendEmailOtp =
    async (email, otp) => {
        await transporter.sendMail({
            from: process.env.SMTP_EMAIL,
            to: email,
            subject:
                'QuickKarigar OTP Verification',
            html: `
                <h2>Your OTP is ${otp}</h2>
                <p>Valid for 5 minutes.</p>
            `
        });
    };
module.exports = sendEmailOtp;