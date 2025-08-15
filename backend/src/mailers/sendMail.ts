import resend from "../config/resend.config";
import { Env } from "../config/env.config";

type Params = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

const getFromEmail = () =>
  Env.NODE_ENV === "development" ? "onboarding@resend.dev" : Env.EMAIL_SENDER;

const getToEmail = (to: string) =>
  Env.NODE_ENV === "development" ? "delivered@resend.dev" : to;

export const sendMail = async ({ to, subject, text, html }: Params) =>
  await resend.emails.send({
    from: getFromEmail(),
    to: getToEmail(to),
    subject,
    text,
    html,
  });
