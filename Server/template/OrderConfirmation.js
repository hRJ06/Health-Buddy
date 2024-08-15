module.exports = async (order, product) => {
  return `<html>
    <head>
      <style>
        /* Add your CSS styles here */
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }

        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fff;
        }

        .header {
          background-color: #232f3e;
          color: #fff;
          padding: 10px 20px;
        }

        .header h1 {
          margin: 0;
          padding: 0;
        }

        .order-details {
          padding: 20px;
          border-bottom: 1px solid #ccc;
        }

        .order-item img {
          max-width: 100px;
          margin-right: 20px;
        }

        .order-item-info {
          flex: 1;
        }

        .order-item-info h2 {
          margin: 0;
          padding: 0;
        }

        .order-item-info p {
          margin: 0;
          padding: 0;
        }

        .total-amount {
          padding: 20px;
          text-align: right;
          font-size: 20px;
        }

        .footer {
          text-align: center;
          padding: 10px 0;
          background-color: #232f3e;
          color: #fff;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmation</h1>
        </div>
        <div class="order-details">
          <p>Your Order ID: ${order._id}</p>
          <p>Here's your product:</p>
          <img src="${product.images[0]}" alt="Product Image"/>
        </div>
        </div>
        <div class="total-amount">
          <p>Payment Due: Rs.${order.price}</p>
        </div>
      </div>
      <div class="footer">
        <p>Thank you for your order!</p>
        <p>You will be notified shortly about further updates for your package.</p>
      </div>
    </body>
  </html>`;
};
