const app = require("./app");

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  // Server started successfully
  console.log(`Server running on port ${PORT}`);
});

// server.on("error", (error) => {
//   if (error.code === "EADDRINUSE") {
//     // Port is already in use
//   }
//   process.exit(1);
// });

// process.on("SIGTERM", () => {
//   server.close(() => {
//     // Process terminated
//   });
// });

// process.on("SIGINT", () => {
//   server.close(() => {
//     process.exit(0);
//   });
// });
