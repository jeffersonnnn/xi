module.exports = {
  apps: [
    {
      name: "web",
      script: "npm",
      args: "start",
      cwd: "/var/www/xi",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        ALLOW_TEST_VOTES: "false",
      },
      max_memory_restart: "500M",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
    {
      name: "worker",
      script: "node",
      args: "--env-file=.env.local --import tsx worker/index.ts",
      cwd: "/var/www/xi",
      env: {
        NODE_ENV: "production",
        ALLOW_TEST_VOTES: "false",
      },
      max_memory_restart: "300M",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      autorestart: true,
    },
  ],
};
