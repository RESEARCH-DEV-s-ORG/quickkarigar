const OTP = require('../../models/OTP');

const generateOtp =
    require('../../utils/generateOtp');

const sendEmailOtp =
    require('../../services/emailService');

const sendSmsOtp =
    require('../../services/smsService');

exports.sendOtp = async (
    req,
    res
) => {
    try {
        const {
            phone,
            email,
            purpose
        } = req.body;
        const otp = generateOtp();
        const expiresAt =
            new Date(
                Date.now() + 5 * 60 * 1000
            );
        await OTP.create({
            phone,
            email,
            otp,
            purpose,
            expiresAt
        });
        if (phone) {
            await sendSmsOtp(phone, otp);
        }
        if (email) {
            await sendEmailOtp(email, otp);
        }
        return res.status(200).json({
            success: true,
            message: 'OTP Sent'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'OTP Send Failed'
        });
    }
};

exports.verifyOtp = async (
    req,
    res
) => {

    try {
        const {
            phone,
            email,
            otp
        } = req.body;

        const otpDoc =
            await OTP.findOne({
                $or: [
                    { phone },
                    { email }
                ],
                otp
            });

        if (!otpDoc) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        if (
            new Date() > otpDoc.expiresAt
        ) {
            return res.status(400).json({
                success: false,
                message: 'OTP Expired'
            });
        }
        otpDoc.verified = true;
        await otpDoc.save();
        res.status(200).json({
            success: true,
            message:
                'OTP Verified Successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Verification Failed'
        });
    }
};