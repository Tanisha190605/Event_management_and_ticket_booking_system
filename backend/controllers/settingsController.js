const fs = require('fs');
const path = require('path');

// @desc    Get current email settings (masked)
// @route   GET /api/settings/email
// @access  Private/Admin
const getEmailSettings = (req, res) => {
  const username = process.env.EMAIL_USERNAME || '';
  const service = process.env.EMAIL_SERVICE || 'gmail';
  const isConfigured = username && username !== 'youremail@gmail.com';

  res.json({
    emailService: service,
    emailUsername: isConfigured ? maskEmail(username) : '',
    isConfigured,
  });
};

// @desc    Update email settings (writes to .env)
// @route   PUT /api/settings/email
// @access  Private/Admin
const updateEmailSettings = (req, res) => {
  try {
    const { emailService, emailUsername, emailPassword } = req.body;

    if (!emailUsername || !emailPassword) {
      return res.status(400).json({ message: 'Email username and password are required' });
    }

    // Update process.env in runtime
    process.env.EMAIL_SERVICE = emailService || 'gmail';
    process.env.EMAIL_USERNAME = emailUsername;
    process.env.EMAIL_PASSWORD = emailPassword;

    // Also persist to .env file
    const envPath = path.join(__dirname, '..', '.env');
    let envContent = '';
    try {
      envContent = fs.readFileSync(envPath, 'utf8');
    } catch (e) {
      envContent = '';
    }

    // Update or add each key
    envContent = setEnvValue(envContent, 'EMAIL_SERVICE', emailService || 'gmail');
    envContent = setEnvValue(envContent, 'EMAIL_USERNAME', emailUsername);
    envContent = setEnvValue(envContent, 'EMAIL_PASSWORD', emailPassword);

    fs.writeFileSync(envPath, envContent, 'utf8');

    res.json({
      message: 'Email settings updated successfully',
      emailService: emailService || 'gmail',
      emailUsername: maskEmail(emailUsername),
      isConfigured: true,
    });
  } catch (error) {
    console.error('Settings update error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Test email settings
// @route   POST /api/settings/email/test
// @access  Private/Admin
const testEmailSettings = async (req, res) => {
  try {
    const sendEmail = require('../utils/emailService');
    const testAddress = req.body.testEmail || process.env.EMAIL_USERNAME;

    await sendEmail({
      email: testAddress,
      subject: 'EMATBS — Email Test',
      message: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #121826; color: #f1f5f9; border-radius: 12px; text-align: center;">
          <h2 style="color: #22c55e;">✅ Email Configuration Working!</h2>
          <p>Your EMATBS email settings are correctly configured.</p>
          <p style="color: #64748b; font-size: 13px;">Sent at ${new Date().toLocaleString()}</p>
        </div>
      `,
    });

    res.json({ message: 'Test email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Email test failed: ' + error.message });
  }
};

// Helper to mask email for display
function maskEmail(email) {
  if (!email || !email.includes('@')) return email;
  const [user, domain] = email.split('@');
  const masked = user.substring(0, 2) + '***' + user.substring(user.length - 1);
  return masked + '@' + domain;
}

// Helper to set a value in .env content
function setEnvValue(envContent, key, value) {
  const regex = new RegExp(`^${key}=.*$`, 'm');
  const line = `${key}=${value}`;
  if (regex.test(envContent)) {
    return envContent.replace(regex, line);
  } else {
    return envContent.trimEnd() + '\n' + line + '\n';
  }
}

module.exports = { getEmailSettings, updateEmailSettings, testEmailSettings };
