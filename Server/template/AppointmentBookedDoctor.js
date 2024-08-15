module.exports = async (appointment, user, slot) => {
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
      .doctor-info {
        background-color: #e6f7ff;
        padding: 10px;
        border-radius: 4px;
        margin-top: 15px;
      }
      .doctor-name {
        font-weight: bold;
        font-size: 18px;
      }
      .doctor-contact {
        font-size: 16px;
        margin-top: 5px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2>New Appointment</h2>
      </div>
      <div class="content">
        <p>A new appointment has been booked by Mr. ${user.firstName} ${user.lastName} with the ID: ${appointment._id}. Please contact them at ${user.phoneNo} or via ${user.email}.</p>
      </div>
      <div class="doctor-info">
        <p>You have a new appointment scheduled:</p>
        <p>Appointment ID: ${appointment._id}</p>
        <p>Patient: ${user.firstName} ${user.lastName}</p>
        <p>Patient Contact: ${user.phoneNo} | ${user.email}</p>
        <p>Appointment Time: ${slot.time} on Date: ${slot.date}</p>
        <p>Slot Address: ${slot.address}</p>
      </div>
    </div>
  </body>
</html>`;
};
