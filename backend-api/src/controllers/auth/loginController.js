const User = require('../../models/User');

const {
    comparePassword
} = require('../../utils/hash');

const generateToken =
    require('../../utils/token');

const logger =
    require('../../utils/logger');

exports.login = async (
    req,
    res
) => {

    try {

        const {
            email,
            phone,
            password,
            deviceToken,
            platform
        } = req.body;

        // VALIDATION
        if (
            (!email && !phone) ||
            !password
        ) {

            return res.status(400).json({
                success: false,
                message:
                    'Email or phone and password required'
            });
        }

        // FIND USER
        const user =
            await User.findOne({
                $or: [
                    email
                        ? {
                            email: email.toLowerCase()
                        }
                        : null,

                    phone
                        ? { phone }
                        : null
                ].filter(Boolean)
            });

        // USER NOT FOUND
        if (!user) {

            logger.warn(
                `Login failed - User not found (${email || phone})`
            );

            return res.status(404).json({
                success: false,
                message:
                    'User not found'
            });
        }

        // ACCOUNT STATUS CHECK
        if (
            user.status ===
            'blocked'
        ) {

            logger.warn(
                `Blocked user login attempt: ${user._id}`
            );

            return res.status(403).json({
                success: false,
                message:
                    'Your account is blocked'
            });
        }

        if (
            user.status ===
            'suspended'
        ) {

            return res.status(403).json({
                success: false,
                message:
                    'Your account is suspended'
            });
        }

        if (
            user.status ===
            'deleted'
        ) {

            return res.status(403).json({
                success: false,
                message:
                    'Account deleted'
            });
        }

        // PASSWORD CHECK
        const isMatch =
            await comparePassword(
                password,
                user.passwordHash
            );

        // INVALID PASSWORD
        if (!isMatch) {

            user.failedLoginAttempts += 1;

            user.lastFailedLoginAt =
                new Date();

            await user.save();

            logger.warn(
                `Invalid password for user: ${user._id}`
            );

            return res.status(401).json({
                success: false,
                message:
                    'Invalid credentials'
            });
        }

        // RESET FAILED LOGIN
        user.failedLoginAttempts = 0;

        user.lastFailedLoginAt = null;

        user.lastLoginAt =
            new Date();

        user.lastSeenAt =
            new Date();

        // SAVE DEVICE TOKEN
        if (
            deviceToken &&
            platform
        ) {

            const exists =
                user.deviceTokens.find(
                    d =>
                        d.token ===
                        deviceToken
                );

            if (!exists) {
                user.deviceTokens.push({
                    token:
                    deviceToken,
                    platform
                });
            }
        }

        await user.save();

        // JWT TOKEN
        const token =
            generateToken({
                _id: user._id,
                role: user.role,
                phone: user.phone
            });

        logger.success(
            `Login success: ${user._id}`
        );

        // RESPONSE
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                phone: user.phone,
                role: user.role,
                authProvider: user.authProvider,
                profilePicture: user.profilePicture,
                isPhoneVerified: user.isPhoneVerified,
                isEmailVerified: user.isEmailVerified,
                isKYCVerified: user.isKYCVerified,
                status: user.status,
                address: user.address,
                createdAt: user.createdAt
            }
        });

    } catch (error) {

        logger.error(
            'Login error',
            error
        );
        return res.status(500).json({
            success: false,
            message:
                'Internal server error'
        });
    }
};