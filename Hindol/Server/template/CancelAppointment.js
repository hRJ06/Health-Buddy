module.exports = async (appointment, user, slot) => {
    return `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 5px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .info {
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Appointment Cancellation Notification</h2>
          </div>
          <div class="info">
            <p>
              Hi ${user.firstName} ${user.lastName},<br>
              We regret to inform you that your appointment has been cancelled.
            </p>
            <p>Appointment Details:</p>
            <ul>
              <li><strong>Appointment ID:</strong> ${appointment._id}</li>
              <li><strong>Date:</strong> ${appointment.date}</li>
              <li><strong>Time:</strong> ${slot.time}</li>
              <li><strong>Address:</strong> ${slot.address}</li>
            </ul>
            <p>If you have any questions or need further assistance, please contact us.</p>
            <p>Thank you for your support.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };
  