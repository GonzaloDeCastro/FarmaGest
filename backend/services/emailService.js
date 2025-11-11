const nodemailer = require('nodemailer');

const buildTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host) {
    console.warn('⚠️  SMTP_HOST no está configurado. Los correos de recuperación no se enviarán.');
    return null;
  }

  const transportConfig = {
    host,
    port,
    secure,
  };

  if (user && pass) {
    transportConfig.auth = { user, pass };
  }

  return nodemailer.createTransport(transportConfig);
};

const sendPasswordResetEmail = async ({ to, name, resetLink }) => {
  const transporter = buildTransporter();

  if (!transporter) {
    console.warn('⚠️  No hay configuración SMTP válida. Se omite el envío de correo.');
    return;
  }

  const from = process.env.RESET_PASSWORD_FROM || process.env.SMTP_USER || 'no-reply@farmagest.com';

  const mailOptions = {
    from,
    to,
    subject: 'Recuperación de contraseña - FarmaGest',
    html: `
      <p>Hola ${name || 'usuario'},</p>
      <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en <strong>FarmaGest</strong>.</p>
      <p>Puedes crear una nueva contraseña haciendo clic en el siguiente enlace:</p>
      <p><a href="${resetLink}" target="_blank" rel="noopener">Restablecer contraseña</a></p>
      <p>Este enlace expirará en 1 hora. Si no solicitaste este cambio, puedes ignorar este correo.</p>
      <p>Saludos,<br/>Equipo FarmaGest</p>
    `,
    text: `Hola ${name || 'usuario'},\n\nHemos recibido una solicitud para restablecer la contraseña de tu cuenta en FarmaGest.\n\nPuedes crear una nueva contraseña ingresando a: ${resetLink}\n\nEste enlace expirará en 1 hora. Si no solicitaste este cambio, puedes ignorar este correo.\n\nSaludos,\nEquipo FarmaGest`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendPasswordResetEmail,
};

