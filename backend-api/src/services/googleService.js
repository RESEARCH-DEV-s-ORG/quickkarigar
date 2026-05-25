const { OAuth2Client } =
    require('google-auth-library');

const logger =
    require('../utils/logger');

const client =
    new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID
    );

const verifyGoogleToken =
    async (idToken) => {
        try {
            const ticket =
                await client.verifyIdToken({
                    idToken,
                    audience:
                    process.env.GOOGLE_CLIENT_ID
                });

            const payload =
                ticket.getPayload();

            return {
                googleId: payload.sub,
                email: payload.email,
                fullName: payload.name,
                profilePicture:
                payload.picture,
                emailVerified:
                payload.email_verified
            };

        } catch (error) {
            logger.error(
                'Google Token Verification Failed',
                error
            );
            throw new Error(
                'Invalid Google Token'
            );
        }
    };

module.exports = {
    verifyGoogleToken
};