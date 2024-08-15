module.exports = async (user, order, product, phoneNo) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    border: 1px solid #ccc;
                }
                .header {
                    text-align: center;
                }
                .details {
                    margin-top: 20px;
                    padding: 10px;
                    background-color: #f5f5f5;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Your Order is Out for Delivery</h1>
                </div>
                <div class="details">
                    <p>Dear ${user.firstName}  ${user.lastName},</p>
                    <p>Your order of ${product.name} is out for delivery.</p>
                    <p><strong>Order Details:</strong></p>
                    <ul>
                        <li>Order ID: ${order._id}</li>
                        <li>Product: ${product.name}</li>
                        <li>Payment Due: Rs.${order.payment === 'Due' ? order.price : 0}</li>
                        <li>Delivery Agent No: ${phoneNo}</li>
                    </ul>
                    <p>Thank you for choosing our service!</p>
                    <p>Best regards,</p>
                    <p>Whisker Whispers</p>
                </div>
            </div>
        </body>
        </html>
    `;
};
