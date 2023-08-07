import nodemailer from 'nodemailer';

async function sendEmail(email: string, number: number) {
  const transporter = nodemailer.createTransport({
    service: 'mail.ru',
    auth: {
      user: 'zarnigor1231@mail.ru',
      pass: 'fU2TmcvcVz4nX7gbUWjD',
    },
  });

  await transporter.sendMail({
    from: 'zarnigor1231@mail.ru',
    to: email,
    subject: 'Code',
    html: `<h1>${number}</h1>`,
  });
}

export default sendEmail;
