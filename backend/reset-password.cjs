const bcrypt = require('bcryptjs');
const User = require('./src/models/User.cjs');

async function resetPassword() {
  try {
    const email = 'mk002theguru@gmail.com';
    const newPassword = '@lewS123';

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log('❌ User not found');
      process.exit(0);
    }

    user.password_hash = hashedPassword;
    await user.save();

    console.log('✅ Password reset for', email);
    console.log('🔑 New password:', newPassword);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}
resetPassword();