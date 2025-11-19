const fs = require("fs");

const logToFile = (message) => {
    fs.appendFileSync("errors.log", message + "\n");
};

const setupErrorHandlers = () => {
    process.on("uncaughtException", (err) => {
        const errorMessage = `[UncaughtException] ${new Date().toISOString()} → ${err.stack}`;
        console.error(errorMessage);
        logToFile(errorMessage);
    });

    process.on("unhandledRejection", (reason) => {
        const errorMessage = `[UnhandledRejection] ${new Date().toISOString()} → ${reason}`;
        console.error(errorMessage);
        logToFile(errorMessage);
    });
};

module.exports = {
    setupErrorHandlers,
    logToFile,
};
