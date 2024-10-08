import nodemailer from "nodemailer";
import { env } from "~/env";

export class Email {
  private EMAIL_AUTH_USER: string = "kirtanfake0412@gmail.com";
  private EMAIL_AUTH_PASS: string = "gypgtexluvrvhszd";
  private host: string = env.EMAIL_HOST;
  private port: number = 587;
  private transporter: nodemailer.Transporter;

  public to: string = "";
  public subject: string = "";
  public html: string = "";
  public text: string = "";

  constructor() {
    this.transporter = this.createTransport();
  }

  private createTransport(): nodemailer.Transporter {
    return nodemailer.createTransport({
      host: this.host,
      port: this.port,
      secure: this.port === 465,
      auth: {
        user: this.EMAIL_AUTH_USER,
        pass: this.EMAIL_AUTH_PASS,
      },
      service: "gmail",
    });
  }

  public async sendEmail(

    callback: (err: string) => void,
  ) {
    try {
      await this.transporter.sendMail({
        from: '"' + "Family root" + '"' + "<" + this.EMAIL_AUTH_USER + ">",
        to: this.to,
        subject: this.subject,
        text: this.text,
        html: this.html,
      });
    } catch (error: any) {
      callback("Email Server Error: " + error.message);
    }
  }
}
