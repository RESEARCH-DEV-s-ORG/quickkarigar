const axios = require('axios');
const logger = require('../utils/logger');

const verifyTruecallerToken = async (authorizationCode) => {
        try {
            const response =
                await axios.post(
                    'https://oauth-account-noneu.truecaller.com/v1/token',
                    {
                        grant_type: 'authorization_code',
                        code: authorizationCode,
                        client_id: process.env.TRUECALLER_CLIENT_ID,
                        client_secret: process.env.TRUECALLER_CLIENT_SECRET
                    },

                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );
            return response.data;

        } catch (error) {
            logger.error(
                'Truecaller verification failed', error.response?.data || error.message
            );
            throw new Error(
                'Invalid Truecaller token'
            );
        }
    };

module.exports = {
    verifyTruecallerToken
};