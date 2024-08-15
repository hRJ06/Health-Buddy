module.exports = async (appointment, slot) => {
  return `<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
      .header {
        background-color: #f2f2f2;
        padding: 10px;
        border-radius: 4px 4px 0 0;
      }
      .content {
        padding: 20px 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2>Appointment Booked</h2>
      </div>
      <div class="content">
        <p>We have booked your appointment with the ID: ${appointment._id}.</p>
        <p>Your appointment is scheduled for Slot Time: ${slot.time} and Address: ${slot.address} on ${slot.date}. Your booking number is ${slot.currentBookings}.</p>
      </div>
    </div>
  </body>
</html>`;
};
