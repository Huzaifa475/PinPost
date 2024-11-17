import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendEmail = async (option) => {
    try {
        const transport = nodemailer.createTransport({
            host: "smtp.mailtrap.com",
            port: 587,
            auth: {
                user: "huzaifa00748@gmail.com",
                pass: "qwerty123@",
            },
        });

        const result = await transport.sendMail({
            from: `"PinPost" <huzaifa00748@gmail.com>`,
            to: option.email,
            subject: option.subject,
            text: option.message,
        });

        console.log("Email sent successfully:", result);
    } catch (error) {
        console.error("Failed to send email:", error.message);
    }
};

export default sendEmail;