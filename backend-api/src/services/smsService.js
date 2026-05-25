const axios = require('axios');

const sendSmsOtp =
    async (phone, otp) => {

        console.log(
            `SMS OTP ${otp} sent to ${phone}`
        );
        // Integrate MSG91/Fast2SMS/Twilio
    };

module.exports = sendSmsOtp;