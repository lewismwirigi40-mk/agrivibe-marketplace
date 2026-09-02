const User = require('./src/models/User.cjs');

async function checkUser() {
  try {
    const email = 'mk002theguru@gmail.com';
    const user = await User.findOne({ where: { email } });
    
    if (user) {
      console.log('✅ User exists:');
      console.log('Email:', user.email);
      console.log('Role:', user.role);
      console.log('First Name:', user.first_name);
      console.log('Last Name:', user.last_name);
      console.log('Phone:', user.phone);
      console.log('Password hash:', user.password_hash);
    } else {
      console.log('❌ User not found');
    }
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}
checkUser();