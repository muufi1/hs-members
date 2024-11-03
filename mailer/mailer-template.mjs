import dotenv from 'dotenv';
dotenv.config();

export function generateEmail(loginkey, recipient) {
    const message = {
        from: process.env.MAILER_SENDER,
        to: recipient,
        subject: "Kirjautuminen Harmaasusien jäsentietopalveluun",
        text: `Salasanasi on: ${loginkey}`
    }
    return message;
}
