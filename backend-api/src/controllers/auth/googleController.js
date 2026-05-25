const User =
    require('../../models/User');

const Session =
    require('../../models/Session');

const generateToken =
    require('../../utils/token');

const logger =
    require('../../utils/logger');

const {
    verifyGoogleToken
} = require('../../services/googleService');

exports.googleLogin =
    async (req, res) => {
        try {
            const { token } = req.body;
            if (!token) {
                return res.status(400).json({
                    success: false,
                    message: 'Google token required'
                });
            }

            // VERIFY GOOGLE TOKEN
            const googleUser =
                await verifyGoogleToken(
                    token
                );

            // FIND EXISTING USER
            let user = await User.findOne({
                    $or: [
                        {
                            email: googleUser.email
                        },
                        {
                            googleId: googleUser.googleId
                        }
                    ]
                });

            // CREATE USER IF NOT EXISTS
            if (!user) {
                user =
                    await User.create({
                        fullName: googleUser.fullName,
                        email: googleUser.email,
                        googleId: googleUser.googleId,
                        profilePicture: googleUser.profilePicture,
                        isEmailVerified: googleUser.emailVerified,
                        authProvider: 'google',
                        role: 'customer'
                    });
                logger.auth(
                    `New Google user registered: ${googleUser.email}`
                );

            } else {
                // UPDATE LOGIN INFO
                user.lastLoginAt = new Date();
                user.profilePicture = googleUser.profilePicture;
                await user.save();

                logger.auth(
                    `Google login: ${googleUser.email}`
                );
            }

            // GENERATE JWT
            const jwtToken =
                generateToken(user);

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
                message: 'Google Login Successful',
                token: jwtToken,
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    phone: user.phone,
                    profilePicture: user.profilePicture,
                    role: user.role
                }
            });

        } catch (error) {
            logger.error(
                'Google Login Failed',
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    'Google Authentication Failed'
            });
        }
    };