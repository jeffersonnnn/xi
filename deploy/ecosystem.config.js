module.exports = {
  apps: [
    {
      name: "web",
      script: "npm",
      args: "start",
      cwd: "/app",
      env_file: "/app/.env",
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
      script: "npx",
      args: "tsx worker/index.ts",
      cwd: "/app",
      env_file: "/app/.env",
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
