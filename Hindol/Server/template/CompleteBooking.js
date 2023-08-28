module.exports = async(product, user) => {
    return `
        <html>
        <head>
        <meta charset="UTF-8">
        <title>Cart Item Reminder</title>
        </head>
        <body style="font-family: Arial, sans-serif; font-size: 14px; color: #333; line-height: 1.6;">
        <p>Hello ${user.firstName} ${user.lastName},</p>
        <p>This is a reminder that the following item is still in your cart:</p>
        <p><strong>Product Name:</strong> ${product.name}</p>
        <p><strong>Product Price:</strong> ${product.price}</p>
        <p><strong>Product Description:</strong> ${product.description}</p>
        <p style="text-align: center;">
            <img src="${product.images[0]}" alt="Product Image" style="max-width: 200px; height: auto;">
        </p>
        <p>Don't miss out on this great item! Click <a href="https://yourwebsite.com/cart" style="color: #007bff; text-decoration: none;">here</a> to view your cart and complete your purchase.</p>
        <p style="margin-top: 30px;">Thank you for shopping with us!</p>
        <p>Best regards,</p>
        <p>Whisker Whispers</p>
        </body>
        </html>    
    `
}