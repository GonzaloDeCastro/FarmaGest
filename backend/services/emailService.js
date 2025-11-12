const nodemailer = require('nodemailer');

const buildTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  const isPlaceholderHost =
    host &&
    /tu_proveedor\.com/i.test(host);

  if (!host || isPlaceholderHost) {
    console.warn('⚠️  SMTP_HOST no está configurado o está usando un placeholder. Los correos no se enviarán.');
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

const formatCurrencyArs = (value) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(Number(value || 0));

const formatDateShort = (value) => {
  if (!value) {
    return '—';
  }
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }
  return date.toISOString().slice(0, 10);
};

const sendLiquidacionObrasSocialesEmail = async ({
  to,
  subject,
  resumen = [],
  totales = {},
  filtros = {},
  totalRegistros = 0,
}) => {
  const transporter = buildTransporter();

  if (!transporter) {
    const error = new Error('Configuración SMTP no disponible');
    error.code = 'SMTP_NOT_CONFIGURED';
    throw error;
  }

  const recipients = Array.isArray(to) ? to : [to];

  const obraSocialIdLabel =
    filtros.obraSocialId !== null && filtros.obraSocialId !== undefined
      ? filtros.obraSocialId
      : 'Todas';

  const filtrosHtml = `
    <ul>
      <li><strong>Obra Social:</strong> ${obraSocialIdLabel}</li>
      <li><strong>Desde:</strong> ${filtros.fechaDesde || '—'}</li>
      <li><strong>Hasta:</strong> ${filtros.fechaHasta || '—'}</li>
      <li><strong>Incluir sin obra social:</strong> ${filtros.incluirSinObraSocial ? 'Sí' : 'No'}</li>
    </ul>
  `;

  const resumenSection = resumen
    .map(
      (grupo) => `
        <h3>${grupo.obra_social}${grupo.plan ? ` - Plan ${grupo.plan}` : ''}</h3>
        <p>
          Ventas: <strong>${grupo.cantidad_ventas}</strong> ·
          Subtotal: <strong>${formatCurrencyArs(grupo.subtotal_total)}</strong> ·
          Aporte obra social: <strong>${formatCurrencyArs(grupo.aporte_obra_social)}</strong> ·
          Total paciente: <strong>${formatCurrencyArs(grupo.total_paciente)}</strong>
        </p>
        <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:960px;font-size:12px;">
          <thead style="background:#f3f3f3;">
            <tr>
              <th align="left">Fecha</th>
              <th align="left">Factura</th>
              <th align="left">Cliente</th>
              <th align="left">DNI</th>
              <th align="right">Subtotal</th>
              <th align="right">Descuento %</th>
              <th align="right">Aporte Obra Social</th>
              <th align="right">Total Paciente</th>
            </tr>
          </thead>
          <tbody>
            ${
              (grupo.detalle || [])
                .map(
                  (venta) => `
                    <tr>
                      <td>${formatDateShort(venta.fecha)}</td>
                      <td>${venta.numero_factura}</td>
                      <td>${[venta.cliente?.nombre, venta.cliente?.apellido].filter(Boolean).join(' ') || '—'}</td>
                      <td>${venta.cliente?.dni || '—'}</td>
                      <td align="right">${formatCurrencyArs(venta.subtotal)}</td>
                      <td align="right">${Number(venta.descuento_porcentaje || 0).toFixed(2)}%</td>
                      <td align="right">${formatCurrencyArs(venta.aporte_obra_social)}</td>
                      <td align="right">${formatCurrencyArs(venta.total_paciente)}</td>
                    </tr>
                  `
                )
                .join('') || '<tr><td colspan="8" align="center">Sin registros</td></tr>'
            }
          </tbody>
        </table>
      `
    )
    .join('<hr style="margin:24px 0;border:none;border-top:1px solid #dddddd;" />');

  const html = `
    <div style="font-family:Arial, Helvetica, sans-serif; color:#333333; line-height:1.5;">
      <h2>Liquidación de Obras Sociales - FarmaGest</h2>
      <p>Adjuntamos el detalle de liquidación de obras sociales generado desde el módulo de auditoría.</p>
      <h3>Filtros aplicados</h3>
      ${filtrosHtml}
      <h3>Totales generales</h3>
      <ul>
        <li><strong>Cantidad de ventas:</strong> ${totales.cantidad_ventas || 0}</li>
        <li><strong>Subtotal facturado:</strong> ${formatCurrencyArs(totales.subtotal_total)}</li>
        <li><strong>Aporte de obras sociales:</strong> ${formatCurrencyArs(totales.aporte_obra_social)}</li>
        <li><strong>Total abonado por pacientes:</strong> ${formatCurrencyArs(totales.total_paciente)}</li>
      </ul>
      <p><strong>Total de registros detallados:</strong> ${totalRegistros}</p>
      ${resumenSection || '<p>No se encontraron ventas bajo los filtros seleccionados.</p>'}
      <p style="margin-top:24px;">Saludos cordiales,<br/>Equipo FarmaGest</p>
    </div>
  `;

  const text = [
    'Liquidación de Obras Sociales - FarmaGest',
    '',
    `Obra Social: ${obraSocialIdLabel}`,
    `Desde: ${filtros.fechaDesde || '—'}`,
    `Hasta: ${filtros.fechaHasta || '—'}`,
    `Incluir sin obra social: ${filtros.incluirSinObraSocial ? 'Sí' : 'No'}`,
    '',
    `Cantidad de ventas: ${totales.cantidad_ventas || 0}`,
    `Subtotal facturado: ${formatCurrencyArs(totales.subtotal_total)}`,
    `Aporte de obras sociales: ${formatCurrencyArs(totales.aporte_obra_social)}`,
    `Total abonado por pacientes: ${formatCurrencyArs(totales.total_paciente)}`,
    '',
    `Total de registros detallados: ${totalRegistros}`,
    '',
    'Para más detalles, revisa la versión en HTML del correo.',
  ].join('\n');

  const from = process.env.RESET_PASSWORD_FROM || process.env.SMTP_USER || 'no-reply@farmagest.com';

  const mailOptions = {
    from,
    to: recipients.join(', '),
    subject: subject || 'Liquidación de Obras Sociales - FarmaGest',
    html,
    text,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendPasswordResetEmail,
  sendLiquidacionObrasSocialesEmail,
};

