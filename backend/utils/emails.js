import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to, subject, react) => {
  const data = await resend.emails.send({
    from: `Food Delivery <${process.env.FROM_EMAIL}>`,
    to,
    subject,
    react,
  });

  return data;
};
