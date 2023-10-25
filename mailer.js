require('dotenv').config();

const nodemailer = require('nodemailer');

const needle = require('needle');

const transporter = nodemailer.createTransport(
    {
        host : 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        } 
    }
)

const sendMail = async (recipientEmail,subject,invoiceUrl, invoiceNumber) => {

      try {

       await transporter.sendMail({
          from: '"Karagandy Technologies" <karagandytechnologies@gmail.com>',
          to: recipientEmail,
          subject: subject,
          html: `<html>
          <head>
            <style>
    
              .footer {
                text-align: center;
                font-size: 14px;
                color: #999999;
              }
              
              .footer-text {
                display: block;
                background-color: #f2f2f2;
                padding: 5px 10px;
                border-radius: 4px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
              }
            </style>
          </head>
          <body>
            <div style="max-width: 600px;margin: 0 auto; border: 2px solid #918E9B;padding: 0px 10px 10px 10px;">
                 <img src="https://karagandytech.s3.amazonaws.com/kt-nobg.png" alt="karagandy technologies logo" style="display:block;margin:auto;" />
                 <p>Dear Esteemed Client,</p>
                 <p>Kindly find attached the invoice detailing our engagement with you and the amount due for payment.</p>
                 <p>Thank you for doing business with us.</p>
                 <p>For any questions, clarifications or enquiries, kindly reach out to us using any of the contact methods at the top of the invoice</p>
                 <p>Best regards,<br>For Karagandy Technologies</p>
                 <div class="footer">
                    <p class="footer-text">
                       &copy; Karagandy Technologies
                    </p>
                 </div>
            </div>
              
          </body>
        </html>
        
        `,
        attachments: [
          {
              filename: `${invoiceNumber + '.pdf'}`,
              content : needle.get(invoiceUrl),
              contentType: 'application/pdf'
          }
        ]
      }
          
      )
        
      } catch (error) {
         throw new Error(error);
      }

    
};


module.exports = sendMail;

