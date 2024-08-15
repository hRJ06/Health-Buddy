module.exports = async (appointment, user,doctor) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' };
    const appointmentDate = new Date(appointment.date);
    const formattedDate = appointmentDate.toLocaleDateString('en-GB', options);
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    border: 1px solid #ccc;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }
                .header {
                    background-color: #f5f5f5;
                    padding: 10px 0;
                    text-align: center;
                }
                .content {
                    padding: 20px;
                }
                .footer {
                    background-color: #f5f5f5;
                    padding: 10px 0;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Appointment Resolved</h1>
                </div>
                <div class="content">
                    <p>Hello ${user.firstName} ${user.lastName},</p>
                    <p>Your appointment on ${formattedDate} with Dr. ${doctor.firstName} ${doctor.lastName} has been resolved.</p>
                    <p>We hope you had a great experience!</p>
                </div>
                <div class="footer">
                    <p>Thank you for using our appointment system.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};