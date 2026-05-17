const fs = require('fs');
const path = require('path');
// ═══════════════════════════════════════
// LOG DIRECTORY
// ═══════════════════════════════════════

const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, {
        recursive: true
    });
}

// ═══════════════════════════════════════
// DATE & TIME
// ═══════════════════════════════════════

const formatTime = () => {

    return new Date().toLocaleString('en-IN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
};

const getLogFileName = () => {

    return new Date()
        .toISOString()
        .split('T')[0];
};

// ═══════════════════════════════════════
// WRITE LOG FILE
// ═══════════════════════════════════════

const writeLog = (type, message) => {

    try {

        const filePath = path.join(
            logsDir,
            `${getLogFileName()}.log`
        );

        const logMessage =
            `[${formatTime()}] [${type}] ${message}\n`;

        fs.appendFileSync(
            filePath,
            logMessage,
            'utf8'
        );

    } catch (error) {

        console.error(
            'Failed to write log file:',
            error.message
        );
    }
};

// ═══════════════════════════════════════
// LOGGER
// ═══════════════════════════════════════

const logger = {

    info: (message) => {

        console.log(
            `\x1b[36m[${formatTime()}] [INFO] ${message}\x1b[0m`
        );

        writeLog('INFO', message);
    },

    success: (message) => {

        console.log(
            `\x1b[32m[${formatTime()}] [SUCCESS] ${message}\x1b[0m`
        );

        writeLog('SUCCESS', message);
    },

    warn: (message) => {
        console.warn(
            `\x1b[33m[${formatTime()}] [WARNING] ${message}\x1b[0m`
        );
        writeLog('WARNING', message);
    },

    error: (message, error = null) => {
        const finalMessage =
            error
                ? `${message} | ${error}`
                : message;

        console.error(
            `\x1b[31m[${formatTime()}] [ERROR] ${finalMessage}\x1b[0m`
        );
        writeLog('ERROR', finalMessage);
    },

    socket: (message) => {
        console.log(
            `\x1b[35m[${formatTime()}] [SOCKET] ${message}\x1b[0m`
        );
        writeLog('SOCKET', message);
    },

    db: (message) => {
        console.log(
            `\x1b[34m[${formatTime()}] [DATABASE] ${message}\x1b[0m`
        );
        writeLog('DATABASE', message);
    },

    api: (message) => {
        console.log(
            `\x1b[90m[${formatTime()}] [API] ${message}\x1b[0m`
        );
        writeLog('API', message);
    }
};

module.exports = logger;