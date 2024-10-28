import { default as nodemailer } from 'nodemailer';
import { options, testRecipient } from './mailer-opts.js';
import { generateEmail } from './mailer-template.js';

const transporter = nodemailer.createTransport(options);

export function testMail() {
    transporter.sendMail(generateEmail('0000',testRecipient));
}

export function sendLoginkey(key, recipient) {
    transporter.sendMail(generateEmail(key, recipient));
}
