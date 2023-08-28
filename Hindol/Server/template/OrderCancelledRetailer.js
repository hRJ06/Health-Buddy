module.exports = async(order, product, user) => {
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
          Dear Retailer,
        </p>
        <p>
          We regret to inform you that the following order has been cancelled by the customer:
        </p>
        <p>
          <span class="highlight">Order Details:</span>
          <br>
          Customer Name: ${user.firstName + " " + user.lastName}  
          <br>
          Order ID: ${order._id}
          <br>
          Product Name: ${product.name} (ID: ${order.productId})
          <br>
          Price: Rs. ${order.price}
          <br>
          Quantity: ${order.quantity}
        </p>
        <p>
          We understand that this may affect your inventory, and we apologize for any inconvenience caused.
        </p>
        <p>
          If you have any questions or need further assistance, please feel free to contact our support team.
        </p>
        <p>
          Thank you for your cooperation, and we appreciate your partnership with us.
        </p>
        <p>
          Best Regards,
          <br>
          Whisky Whisper
        </p>
      </body>
    </html>
  `;

}