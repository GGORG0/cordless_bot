module.exports = {
  apps: [
    {
      name: "cordless_bot",
      script: "./index.js",
      watch: true,
      env: {
        IN_PM2: true,
      },
    },
  ],
};
