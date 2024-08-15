module.exports = async (order, product) => {
    return `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            h1 {
              color: #ff5733;
            }
            p {
              margin-bottom: 16px;
            }
            .highlight {
              background-color: #ffe6e6;
              padding: 8px;
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
          <h1>Order Cancelled</h1>
          <p>
            Dear Customer,
          </p>
          <p>
            We are sorry to inform you that your order for product ${product.name} (ID: ${order.productId}) has been cancelled.
          </p>
          <p>
            <span class="highlight">Order Details:</span>
            <br>
            Order ID: ${order._id}
            <br>
            Price: Rs. ${order.price}
          </p>
          <p>
            If you have any questions or need further assistance, please feel free to contact our support team.
          </p>
          <p>
            Thank you for considering our services, and we hope to serve you better in the future.
          </p>
          <p>
            Best Regards,
            <br>
            Whisker Whispers
          </p>
        </body>
      </html>
    `;
  };