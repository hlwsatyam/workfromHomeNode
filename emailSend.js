const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail", auth: { user: "satyampandit021@gmail.com", pass: "mnlm kfcp wzwb dthw", },
});

const emailSender = {
    sentPassword: async (email, name, password) => {
        let isEmailSent = false;

        try {
            const mailOptions = {
                from: "satyampandit021@gmail.com", // Sender address
                to: email, // Recipient's email
                subject: "Welcome to Vihan Enterprises - Your Work-from-Home Journey Begins",
                html: `
            <div style="font-family: Arial, sans-serif; background-color: #f0f4f7; padding: 40px 0;">
              <div style="max-width: 600px; background-color: white; margin: 0 auto; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
                <!-- Header with background image -->
                <div style="background-image: url('https://images.unsplash.com/photo-1511732351157-1865efcb7b7b?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'); background-size: cover; padding: 20px 30px; text-align: center; color: #fff;">
                  <h2 style="font-size: 28px; margin-bottom: 10px;">Welcome to Vihan Enterprises, ${name}!</h2>
                  <p style="font-size: 18px;">Your Gateway to Earning Money from Home</p>
                </div>
                
                <!-- Email body -->
                <div style="padding: 30px;">
                  <h3 style="color: #333; text-align: center;">Your Account is Ready!</h3>
                  <p style="font-size: 16px; color: #555; text-align: center;">
                    Congratulations on joining Vihan Enterprises, where you can earn money from the comfort of your home. We are excited to have you onboard!
                  </p>
                  <p style="font-size: 16px; color: #555; text-align: center;">
                    Below is your password to log into your account and start exploring various opportunities to earn:
                  </p>
                  <!-- Password Section -->
                  <div style="text-align: center; margin: 5px 0;">
                    <span style="font-size: 24px; font-weight: bold; color: #4CAF50;">Email: ${email}</span>
                  </div>
                  <div style="text-align: center; margin: 5px 0;">
                    <span style="font-size: 24px; font-weight: bold; color: #4CAF50;">Password: ${password}</span>
                  </div>
                  <div style="text-align: center; margin: 5px 0;">
                     <a href="https://vihanenterprises.online/login" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-size: 16px; margin-top: 20px;">vihanenterprises.online</a>
                  </div>
                  <p style="font-size: 16px; color: #555; text-align: center;">
                    Please keep this password secure and change it once you log in.
                  </p>
                  
                  <!-- CTA and benefits -->
                  <div style="margin-top: 30px; padding: 20px; background-color: #e9f7ef; border-radius: 10px; text-align: center;">
                    <h4 style="color: #27ae60; margin-bottom: 15px;">Why Choose Vihan Enterprises?</h4>
                    <ul style="list-style-type: none; padding: 0;">
                      <li style="margin-bottom: 10px; font-size: 16px; color: #555;">✔ Work from the comfort of your home</li>
                      <li style="margin-bottom: 10px; font-size: 16px; color: #555;">✔ Earn money instantly for completed tasks</li>
                      <li style="margin-bottom: 10px; font-size: 16px; color: #555;">✔ Flexible working hours that suit your schedule</li>
                      <li style="font-size: 16px; color: #555;">✔ Join a community of earners making money online!</li>
                    </ul>
                  </div>
                  
                  <!-- Closing message -->
                  <p style="font-size: 14px; color: #777; text-align: center; margin-top: 30px;">
                    Start your journey today and explore tasks that suit your skills. We are here to help you achieve your financial goals!
                  </p>
                </div>
      
                <!-- Footer -->
                <div style="background-color: #f0f4f7; padding: 20px; text-align: center; color: #888;">
                  <p style="font-size: 12px;">&copy; 2024 Vihan Enterprises. All rights reserved.</p>
                  <p style="font-size: 12px;">For support or inquiries, contact us at support@Vihanenterprises.online</p>
                </div>
              </div>
            </div>
            `,
            };

            await transporter.sendMail(mailOptions);
            isEmailSent = true;
        } catch (error) {
            console.log(error);
            isEmailSent = false;
        }

        return { isEmailSent };
    }

}


module.exports = { emailSender };
