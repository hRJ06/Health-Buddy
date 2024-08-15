const PDFDocument = require('pdfkit');

async function createPDF(order) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const pdfChunks = [];

        doc.on('data', (chunk) => {
            pdfChunks.push(chunk);
        });

        doc.on('end', () => {
            const pdfBuffer = Buffer.concat(pdfChunks);
            resolve(pdfBuffer);
        });

        doc.fontSize(16).text(`Order ID: ${order._id}`);
        doc.fontSize(14).text(`Date: ${new Date().toLocaleString()}`);
        doc.fontSize(12).text(`Total Amount: ${order.price}`);

        doc.font('Helvetica-Bold').fontSize(20).text('Thank You for shopping with us!', {
            align: 'center',
            underline: true,
        });

        doc.font('Helvetica').fontSize(14).text('Order delivery confirmed', {
            align: 'center',
            underline: true,
        });

        doc.end();
    });
}

module.exports = createPDF;
