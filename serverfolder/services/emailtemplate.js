const VerifyTemplate=(otp)=>{
  return (`<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
<div style=" margin:50px auto;width:70%;padding:20px 0">
  <div style="border-bottom:1px solid #eee">
     <a href="https://appychild.uk" style="font-size: 1.4em; color: #00466a; text-decoration: none; font-weight: 600;">
        <img width="200" src="https://appychild.uk/logopng.png" alt="AppyChild" />
        <p style="text-color:blue">AppyChild</p>
      </a>
  </div>
  <p style="font-size:1.1em">Hi,</p>
  <p>Thank you for choosing Appychild. Use the following OTP to complete your Sign Up procedures. OTP is valid for 2 minutes</p>
  <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
  <p style="font-size:0.9em;">Regards,<br /><img width="200" src="https://appychild.uk/logopng.png" alt="AppyChild" />
</p>
  <hr style="border:none;border-top:1px solid #eee" />
  <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
    <p>AppyChild</p>
    <p>+03601 885399</p>
    <p>United Kingdom</p>
  </div>
</div>
</div>`
)}
const SendPayment = (
invoiceid,
startdate,
enddate,
days,
totalamount,
childfullname,
bankname,
accountno,
sortcode,
firstname
) => {
return `
<div style="font-family: Helvetica, Arial, sans-serif; min-width: 600px; overflow: auto; line-height: 2; color: #333;">
  <div style="margin: 50px auto; width: 70%; padding: 20px 0;">
    <div style="border-bottom: 1px solid #eee; padding-bottom: 20px;">
      <a href="https://appychild.uk" style="font-size: 1.4em; color: #00466a; text-decoration: none; font-weight: 600;">
        <img width="200" src="https://appychild.uk/logopng.png" alt="AppyChild" />
        <p style="text-color:blue">AppyChild</p>
      </a>
    </div>
    <p style="font-size: 1.1em;">Hi ${firstname},</p>
    <p style="font-size: 1.2em;">We have received your payment. Below are the details:</p>
    <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
      <tr>
        <th style="text-align: left; padding: 8px; background: #f7f7f7; border: 1px solid #ddd;">Invoice ID:</th>
        <td style="padding: 8px; border: 1px solid #ddd;">#000${invoiceid}</td>
      </tr>
      <tr>
        <th style="text-align: left; padding: 8px; background: #f7f7f7; border: 1px solid #ddd;">Child's Full Name:</th>
        <td style="padding: 8px; border: 1px solid #ddd;">${childfullname}</td>
      </tr>
      <tr>
        <th style="text-align: left; padding: 8px; background: #f7f7f7; border: 1px solid #ddd;">Start Date:</th>
        <td style="padding: 8px; border: 1px solid #ddd;">${startdate}</td>
      </tr>
      <tr>
        <th style="text-align: left; padding: 8px; background: #f7f7f7; border: 1px solid #ddd;">End Date:</th>
        <td style="padding: 8px; border: 1px solid #ddd;">${enddate}</td>
      </tr>
      <tr>
        <th style="text-align: left; padding: 8px; background: #f7f7f7; border: 1px solid #ddd;">Total Days:</th>
        <td style="padding: 8px; border: 1px solid #ddd;">${days}</td>
      </tr>
      <tr>
        <th style="text-align: left; padding: 8px; background: #f7f7f7; border: 1px solid #ddd;">Total Amount:</th>
        <td style="padding: 8px; border: 1px solid #ddd;">${totalamount}</td>
      </tr>
      <tr>
        <th style="text-align: left; padding: 8px; background: #f7f7f7; border: 1px solid #ddd;">Bank Name:</th>
        <td style="padding: 8px; border: 1px solid #ddd;">${bankname}</td>
      </tr>
      <tr>
        <th style="text-align: left; padding: 8px; background: #f7f7f7; border: 1px solid #ddd;">Account Number:</th>
        <td style="padding: 8px; border: 1px solid #ddd;">${accountno}</td>
      </tr>
      <tr>
        <th style="text-align: left; padding: 8px; background: #f7f7f7; border: 1px solid #ddd;">Sort Code:</th>
        <td style="padding: 8px; border: 1px solid #ddd;">${sortcode}</td>
      </tr>
    </table>
    <p style="font-size: 1em;">If you have any questions, feel free to contact us.</p>
    <p style="font-size: 1em;">Regards,<br />The AppyChild Team</p>
    <hr style="border: none; border-top: 1px solid #eee;" />
    <div style="text-align: center; padding: 8px 0; color: #aaa; font-size: 0.8em; line-height: 1; font-weight: 300;">
      <p>AppyChild</p>
      <p>+03601 885399</p>
      <p>United Kingdom</p>
    </div>
  </div>
</div>`;
}
const ContactEmail = (fullname, email, subject, message) => {
return `
<div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
  <div style="text-align: center;">
    <a href="https://appychild.uk" style="font-size: 1.4em; color: #00466a; text-decoration: none; font-weight: 600;">
      <img width="200" src="https://appychild.uk/logopng.png" alt="AppyChild" />
      <p style="color: #00466a;">AppyChild</p>
    </a>
  </div>
  <h2 style="color: #4CAF50;">Hello ${fullname},</h2>
  <p>Thank you for reaching out to us with your concern.</p>
  <p>We have received your message regarding the subject: <strong>${subject}</strong>.</p>
  <p>Our team is currently reviewing your message and will get back to you as soon as possible.</p>
  <p>Your message was:</p>
  <blockquote style="background-color: #f9f9f9; border-left: 5px solid #ccc; margin: 20px 0; padding: 10px 20px;">
    "${message}"
  </blockquote>
  <p>If you have any additional information or queries, feel free to reply to this email. However, please note that this is an automated response and replies to this email may not be monitored.</p>
  <p>Thank you for your patience and understanding.</p>
  <p>Best regards,</p>
  <p>The Support Team</p>
  <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;" />
  <p style="font-size: 0.9em; color: #777;">This is an automated response from a no-reply email address. Please do not reply to this email directly.</p>
</div>
`;
};
const ConfirmPayment = (id, startdate, enddate, days, totalamount, childfullname, firstname) => {
return `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="text-align: center;">
    <a href="https://appychild.uk" style="font-size: 1.4em; color: #00466a; text-decoration: none; font-weight: 600;">
      <img width="200" src="https://appychild.uk/logopng.png" alt="AppyChild" />
      <p style="color: #00466a;">AppyChild</p>
    </a>
  </div>
  <h2 style="color: #4CAF50;">Payment Confirmation</h2>
  <p>Dear ${firstname},</p>
  <p>We are pleased to confirm that your payment has been successfully processed.</p>
  <p>Here are the details of your transaction:</p>
  <ul style="list-style-type: none; padding-left: 0;">
    <li><strong>Payment ID:</strong> ${id}</li>
    <li><strong>Subscription Start Date:</strong> ${startdate}</li>
    <li><strong>Subscription End Date:</strong> ${enddate}</li>
    <li><strong>Duration:</strong> ${days} days</li>
    <li><strong>Total Amount:</strong> £${totalamount}</li>
    <li><strong>Child's Name:</strong> ${childfullname}</li>
  </ul>
  <p>Your subscription is now active, and you can start enjoying all the features and benefits.</p>
  <p>If you have any questions or need further assistance, please don't hesitate to contact our support team.</p>
  <p>Thank you for choosing AppyChild!</p>
  <p>Best regards,</p>
  <p>The AppyChild Team</p>
  <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;" />
  <p style="font-size: 0.9em; color: #777;">This is an automated email. Please do not reply directly to this email.</p>
</div>
`;
};


module.exports={
VerifyTemplate,
SendPayment,
ContactEmail,
ConfirmPayment,
}