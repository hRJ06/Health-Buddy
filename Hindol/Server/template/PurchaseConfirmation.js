module.exports = async () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Purchase Confirmation</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 5px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .header h1 {
              color: #333;
            }
            .thank-you {
              text-align: center;
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 20px;
            }
            .order-confirmed {
              text-align: center;
              font-size: 18px;
              margin-bottom: 30px;
            }
            .order-details {
              margin-bottom: 30px;
            }
            .order-details p {
              margin: 0;
              padding: 5px 0;
            }
            .footer {
              text-align: center;
              font-size: 12px;
              color: #999;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Purchase Confirmation</h1>
            </div>
            <div class="thank-you">Thank You for Shopping with Us!</div>
            <div class="order-confirmed">Order Delivery Confirmed</div>
            <div>Receipt is attached.</div>
            <div class="footer">
              This is an automated email. Please do not reply to this email.
            </div>
          </div>
        </body>
      </html>
    `;
  };
  