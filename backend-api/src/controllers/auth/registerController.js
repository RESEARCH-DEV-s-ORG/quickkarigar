const User =
    require('../../models/User');

const {
    hashPassword
} = require('../../utils/hash');

const generateToken =
    require('../../utils/token');

const logger =
    require('../../utils/logger');

exports.register = async (
    req,
    res
) => {

    try {

        const {

            fullName,
            username,
            email,
            phone,
            countryCode,
            password,
            role,

            gender,
            dateOfBirth,

            address,

            deviceToken,
            platform,

            termsAccepted

        } = req.body;

        // VALIDATION
        if (
            !fullName ||
            !phone ||
            !password
        ) {

            return res.status(400).json({

                success: false,

                message:
                    'Full name, phone and password are required'
            });
        }

        // TERMS CHECK
        if (!termsAccepted) {

            return res.status(400).json({

                success: false,

                message:
                    'Terms and Privacy Policy must be accepted'
            });
        }

        // CHECK EXISTING USER
        const existingUser =
            await User.findOne({

                $or: [

                    email
                        ? {
                            email:
                                email.toLowerCase()
                        }
                        : null,

                    phone
                        ? { phone }
                        : null,

                    username
                        ? {
                            username:
                                username.toLowerCase()
                        }
                        : null

                ].filter(Boolean)
            });

        if (existingUser) {

            let field =
                'User';

            if (
                existingUser.email ===
                email
            ) {

                field = 'Email';
            }

            else if (
                existingUser.phone ===
                phone
            ) {

                field = 'Phone number';
            }

            else if (
                existingUser.username ===
                username?.toLowerCase()
            ) {

                field = 'Username';
            }

            return res.status(409).json({

                success: false,

                message:
                    `${field} already exists`
            });
        }

        // HASH PASSWORD
        const passwordHash =
            await hashPassword(
                password
            );

        // CREATE USER
        const user =
            await User.create({

                // BASIC
                fullName,

                username:
                    username
                        ? username.toLowerCase()
                        : undefined,

                email:
                    email
                        ? email.toLowerCase()
                        : undefined,

                phone,

                countryCode:
                    countryCode || '+91',

                // AUTH
                passwordHash,

                authProvider:
                    'local',

                // ROLE
                role:
                    role || 'customer',

                // PROFILE
                gender,

                dateOfBirth,

                // ADDRESS
                address: {

                    line1:
                    address?.line1,

                    line2:
                    address?.line2,

                    city:
                    address?.city,

                    district:
                    address?.district,

                    state:
                    address?.state,

                    country:
                        address?.country || 'India',

                    postalCode:
                    address?.postalCode,

                    coordinates:
                    address?.coordinates
                },

                // LEGAL
                termsAccepted: true,

                termsAcceptedAt:
                    new Date(),

                privacyAcceptedAt:
                    new Date(),

                // DEVICE TOKEN
                deviceTokens:
                    deviceToken &&
                    platform
                        ? [
                            {
                                token:
                                deviceToken,

                                platform
                            }
                        ]
                        : []
            });

        // UPDATE SECURITY DATA
        user.passwordChangedAt =
            new Date();

        user.lastLoginAt =
            new Date();

        user.lastSeenAt =
            new Date();

        await user.save();

        // GENERATE JWT
        const token =
            generateToken({

                _id: user._id,

                role: user.role,

                phone: user.phone
            });

        logger.auth(
            `New user registered: ${user.phone}`
        );

        // RESPONSE
        return res.status(201).json({

            success: true,

            message:
                'Account created successfully',

            token,

            user: {

                id: user._id,

                fullName:
                user.fullName,

                username:
                user.username,

                email:
                user.email,

                phone:
                user.phone,

                countryCode:
                user.countryCode,

                role:
                user.role,

                authProvider:
                user.authProvider,

                profilePicture:
                user.profilePicture,

                isPhoneVerified:
                user.isPhoneVerified,

                isEmailVerified:
                user.isEmailVerified,

                isKYCVerified:
                user.isKYCVerified,

                kycStatus:
                user.kycStatus,

                status:
                user.status,

                address:
                user.address,

                createdAt:
                user.createdAt
            }
        });

    } catch (error) {

        logger.error(
            'Register failed',
            error
        );

        return res.status(500).json({
            success: false,
            message:
                'Internal server error'
        });
    }
};