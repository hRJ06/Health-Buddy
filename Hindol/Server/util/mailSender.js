const nodemailer = require('nodemailer');
require('dotenv').config();

const mailSender = async (email, title, body,attachments) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        })
        let info = await transporter.sendMail({
            from: 'Google Classroom Team',
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
            attachments: attachments
        })
        return info;
    }
    catch (err) {
        console.error(err.message);
    }
}


module.exports = mailSender;