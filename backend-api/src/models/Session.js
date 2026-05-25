const mongoose =
    require('mongoose');

const sessionSchema =
    new mongoose.Schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        token: {
            type: String,
            required: true
        },
        refreshToken: {
            type: String
        },
        device: {
            type: String,
            default: 'Unknown Device'
        },
        deviceId: {
            type: String
        },

        platform: {
            type: String,
            enum: [
                'android',
                'ios',
                'web',
                'desktop',
                'unknown'
            ],
            default: 'unknown'
        },

        appVersion: {
            type: String
        },

        ipAddress: {
            type: String
        },
        location: {
            country: String,
            state: String,
            city: String,
            timezone: String
        },
        loginMethod: {
            type: String,
            enum: [
                'email',
                'phone',
                'google',
                'truecaller',
                'telegram'
            ]
        },
        isActive: {
            type: Boolean,
            default: true
        },
        expiresAt: {
            type: Date,
            default: () => {
                const date = new Date();
                date.setDate(
                    date.getDate() + 30
                );
                return date;
            }
        },
        lastActivityAt: {
            type: Date,
            default: Date.now
        }

    }, {
        timestamps: true
    });

// AUTO DELETE EXPIRED SESSIONS
sessionSchema.index(
    {
        expiresAt: 1
    },
    {
        expireAfterSeconds: 0
    }
);

module.exports =
    mongoose.model(
        'Session',
        sessionSchema
    );