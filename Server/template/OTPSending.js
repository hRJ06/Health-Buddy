module.exports = async (otp, order) => {
    return `
        <html>
        <head>
        <style>
            body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
            }
        
            h1 {
            color: #007BFF;
            }
        
            p {
            margin-bottom: 10px;
            }
        
            .order-details {
            background-color: #f9f9f9;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 15px;
            }
        
            .otp-container {
            text-align: center;
            background-color: #6DA542;
            padding: 15px;
            border-radius: 10px;
            color: #fff;
            font-size: 24px;
            font-weight: bold;
            animation: fadeIn 1s ease-in-out;
            }
        
            .order-details {
            animation: slideIn 1s ease-in-out;
            }
        
            .footer {
            text-align: center;
            color: #888;
            margin-top: 20px;
            animation: fadeIn 1s ease-in-out;
            }
        
            @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
            }
        
            @keyframes slideIn {
            from {
                transform: translateY(-10%);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
            }
        </style>
        </head>
        <body>
        <h1>Dear ${order.userId.firstName} ${order.userId.lastName},</h1>
        
        <p>Thank you for your purchase. To complete your order, please use the following One-Time Password (OTP):</p>
        
        <div class="otp-container">
            ${otp}
        </div>
        
        <div class="order-details">
            <p><strong>Order Details:</strong></p>
            <p><strong>Order ID:</strong> ${order._id}</p>
            <p>Amount: ${order.price}</p>
        </div>
        
        <p>If you didn't initiate this purchase or have any concerns, please contact our support team immediately.</p>
        
        <p>Thank you for choosing us!</p>
        
        <div class="footer">
            <p>Best regards,</p>
            <p>Whisker Whispers</p>
        </div>
        </body>
        </html>    
    `;
};
  