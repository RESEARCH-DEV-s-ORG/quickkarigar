const User = require('../../models/User');
const Session = require('../../models/Session');
const logger = require('../../utils/logger');
const generateToken = require('../../utils/token');

const {
    verifyTruecallerToken
} = require(
    '../../services/truecallerService'
);

exports.truecallerLogin = async (req, res) => {
        try {
            const {
                authorizationCode
            } = req.body;
            if (!authorizationCode) {
                return res.status(400).json({
                    success: false,
                    message: 'Authorization code required'
                });
            }
            // VERIFY WITH TRUECALLER
            const tcData =
                await verifyTruecallerToken(
                    authorizationCode
                );
            /*
                Expected response example:

                {
                    access_token,
                    id_token,
                    phone_number,
                    name,
                    email,
                    picture
                }
            */
            const phone = tcData.phone_number;
            if (!phone) {
                return res.status(400).json({
                    success: false,
                    message: 'Phone number not found'
                });
            }

            // FIND USER
            let user =
                await User.findOne({
                    phone
                });

            // CREATE USER IF NOT EXISTS
            if (!user) {
                user =
                    await User.create({
                        fullName: tcData.name || 'Truecaller User',
                        phone,
                        email: tcData.email,
                        profilePicture: tcData.picture,
                        authProvider: 'truecaller',
                        isPhoneVerified: true,
                        role: 'customer'
                    });
                logger.auth(
                    `New Truecaller user registered: ${phone}`
                );
            } else {
                // UPDATE USER
                user.lastLoginAt = new Date();
                user.isPhoneVerified = true;

                if (tcData.picture) {
                    user.profilePicture = tcData.picture;
                }
                await user.save();
                logger.auth(
                    `Truecaller login: ${phone}`
                );
            }
            // GENERATE JWT
            const jwtToken = generateToken(user);

            // SAVE SESSION
            await Session.create({
                userId: user._id,
                token: jwtToken,
                ipAddress: req.ip,
                device: req.headers['user-agent']
            });

            // RESPONSE
            return res.status(200).json({
                success: true,
                message: 'Truecaller login successful',
                token: jwtToken,
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    phone: user.phone,
                    email: user.email,
                    role: user.role,
                    profilePicture: user.profilePicture
                }
            });
        } catch (error) {
            logger.error(
                'Truecaller login failed',
                error
            );
            return res.status(500).json({
                success: false,
                message: 'Truecaller authentication failed'
            });
        }
    };