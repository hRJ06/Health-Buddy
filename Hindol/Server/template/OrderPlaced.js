module.exports = async (retailer, product, order) => {
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
            <h1>New Order Placed</h1>
          </div>
          <div class="order-details">
            <p>Dear ${retailer.firstName + " " + retailer.lastName},</p>
            <p>An order has been placed for the following product:</p>
            <div class="order-item">
              <img src="${product.images[0]}" alt="Product Image">
              <div class="order-item-info">
                <h2>${product.name}</h2>
                <p>ID: ${product._id}</p>
                <p>Price: ${product.price}</p>
                <!-- You can include additional product information here -->
              </div>
            </div>
          </div>
          <div class="total-amount">
            <p>Total Quantity Ordered: ${order.quantity}</p>
          </div>
        </div>
        <div class="footer">
          <p>Thank you for using our service!</p>
        </div>
      </body>
    </html>`;
  };
  