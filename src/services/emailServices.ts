import nodemailer from 'nodemailer';
import 'dotenv/config'


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD
    }
  });
  
export async function sendVerificationEmail(to: string, username: string, validateEmailToken: string) {

    await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to,
        subject: "Validate Email - Progetto Ricette",
        html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Ciao ${username}!</h2>
                    <p>Grazie per esserti registrato a Progetto Ricette. Per completare la registrazione, verifica il tuo indirizzo email cliccando sul link qui sotto:</p>
                    <p>
                        <a href="http://localhost:3000/auth/verify-email?token=${validateEmailToken}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
                            Verifica Email
                        </a>
                    </p>
                    <p>Se non riesci a cliccare sul pulsante, copia e incolla questo link nel tuo browser:</p>
                    <p>http://localhost:3000/auth/verify-email?token=${validateEmailToken}</p>
                    <p>Se non hai richiesto questa email, ignorala semplicemente.</p>
                    <p>Grazie,<br>Il team di Progetto Ricette</p>
                </div>
    `
      });
  }