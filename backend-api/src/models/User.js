const mongoose =
    require('mongoose');

const userSchema =
    new mongoose.Schema({
        // BASIC INFO
        fullName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 120
        },
        username: {
            type: String,
            unique: true,
            sparse: true,
            lowercase: true,
            trim: true
        },
        email: {
            type: String,
            unique: true,
            sparse: true,
            lowercase: true,
            trim: true
        },
        phone: {
            type: String,
            required: false,
            default: null,
            unique: true,
            trim: true
        },
        countryCode: {
            type: String,
            default: '+91'
        },
        // AUTH
        passwordHash: {
            type: String
        },
        authProvider: {
            type: String,
            enum: [
                'local',
                'google',
                'truecaller',
                'telegram',
                'phone'
            ],
            default: 'local'
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true
        },
        telegramId: {
            type: String,
            unique: true,
            sparse: true
        },
        truecallerId: {
            type: String,
            unique: true,
            sparse: true
        },
        // ROLE
        role: {
            type: String,
            enum: [
                'customer',
                'worker',
                'admin',
                'super_admin'
            ],
            default: 'customer'
        },
        // VERIFICATION
        isPhoneVerified: {
            type: Boolean,
            default: false
        },
        isEmailVerified: {
            type: Boolean,
            default: false
        },
        isKYCVerified: {
            type: Boolean,
            default: false
        },
        kycStatus: {
            type: String,
            enum: [
                'pending',
                'submitted',
                'approved',
                'rejected'
            ],
            default: 'pending'
        },
        // PROFILE
        profilePicture: {
            type: String,
            default: ''
        },
        coverPhoto: {
            type: String,
            default: ''
        },
        bio: {
            type: String,
            maxlength: 500
        },
        gender: {
            type: String,
            enum: [
                'male',
                'female',
                'other'
            ]
        },

        dateOfBirth: {
            type: Date
        },
        language: {
            type: String,
            default: 'en'
        },

        // ADDRESS
        address: {
            line1: String,
            line2: String,
            city: String,
            district: String,
            state: String,
            country: {
                type: String,
                default: 'India'
            },
            postalCode: String,
            coordinates: {
                type: [Number],
                index: '2dsphere'
            }
        },
        // ACCOUNT STATUS
        status: {
            type: String,
            enum: [
                'active',
                'blocked',
                'suspended',
                'deleted'
            ],
            default: 'active'
        },
        blockReason: String,
        // SECURITY
        failedLoginAttempts: {
            type: Number,
            default: 0
        },
        lastFailedLoginAt: Date,
        passwordChangedAt: Date,
        lastLoginAt: Date,
        lastSeenAt: Date,
        // DEVICE TOKENS
        deviceTokens: [
            {
                token: String,
                platform: {
                    type: String,
                    enum: [
                        'android',
                        'ios',
                        'web'
                    ]
                },
                createdAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
        // LEGAL
        termsAccepted: {
            type: Boolean,
            default: false
        },
        termsAcceptedAt: Date,
        privacyAcceptedAt: Date

    }, {
        timestamps: true
    });

// INDEXES
userSchema.index({
    role: 1
});
userSchema.index({
    status: 1
});
module.exports =
    mongoose.model(
        'User',
        userSchema
    );