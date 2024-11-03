import dotenv from 'dotenv';
dotenv.config();

export const options = {
    port: 465,
    host: process.env.MAILER_HOST, 
    auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS
    },
    secure: true,
    logger: true,
    debug: true
}

export const testRecipient = process.env.MAILER_TESTRECIPIENT;
