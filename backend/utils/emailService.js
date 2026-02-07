const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            html
        };

        console.log(`[EmailService] Attempting to send email to: ${to}`);
        const info = await transporter.sendMail(mailOptions);
        console.log(`[EmailService] Email sent successfully to ${to}. MessageID: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        // Don't throw error to prevent blocking the main flow, but log it
        return null;
    }
};

module.exports = sendEmail;
