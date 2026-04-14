const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Read email config — prefer runtime settings from env (which can be updated via settings API)
  const emailUser = process.env.EMAIL_USERNAME;
  const emailPass = process.env.EMAIL_PASSWORD;
  const emailService = process.env.EMAIL_SERVICE || 'gmail';

  if (!emailUser || !emailPass || emailUser === 'youremail@gmail.com') {
    console.log('═══════════════════════════════════════════');
    console.log('📧 EMAIL (Not Configured — console output):');
    console.log('   To:', options.email);
    console.log('   Subject:', options.subject);
    console.log('   Configure email in Admin → Settings');
    console.log('═══════════════════════════════════════════');
    return;
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    service: emailService,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  const mailOptions = {
    from: `"EMATBS" <${emailUser}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
    attachments: options.attachments || [],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
  } catch (error) {
    console.error('❌ Email error:', error.message);
    throw error;
  }
};

module.exports = sendEmail;
