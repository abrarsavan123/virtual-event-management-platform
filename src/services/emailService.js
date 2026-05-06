/**
 * Mock email service for demonstration purposes.
 * In a real-world scenario, you would use nodemailer or a service like SendGrid/Mailgun.
 */
const sendRegistrationEmail = async (userEmail, eventTitle) => {
  const timeout = process.env.NODE_ENV === 'test' ? 10 : 1000;
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`[Email Service] Sending registration confirmation email to: ${userEmail}`);
      console.log(`[Email Service] Subject: Registration Successful for ${eventTitle}`);
      console.log(`[Email Service] Body: You have successfully registered for the event: ${eventTitle}. Enjoy!`);
      resolve({ success: true, message: 'Email sent successfully (mocked)' });
    }, timeout);
  });
};

module.exports = {
  sendRegistrationEmail,
};
