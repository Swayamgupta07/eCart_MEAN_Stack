const app = require('./app');

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
    console.log(`Server running in development mode on port ${PORT}`);
    console.log(`API base URL: http://localhost:${PORT}`);
});

process.on('unhandledRejection', (err, promise) => {
    console.error(`Unhandled Rejection Error: ${err.message}`);
    server.close(() => process.exit(1));
});
