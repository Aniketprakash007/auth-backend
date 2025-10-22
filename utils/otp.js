const nodemailer = require('nodemailer');

const sendOTP = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Auth System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP is: ${otp}`,
    });
  } catch (err) {
    console.error('Error sending OTP:', err);
    throw new Error('Could not send OTP email');
  }
};

module.exports = sendOTP;
