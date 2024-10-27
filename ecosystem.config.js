export default {
    apps: [
      {
        name: 'myecampus-api',
        script: './src/server.js', 
        env: {
          NODE_ENV: 'production',
          MYSQL_HOST: process.env.MYSQL_HOST,
          MYSQL_USER: process.env.MYSQL_USER,
          MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
          MYSQL_DATABASE_NAME: process.env.MYSQL_DATABASE_NAME,
          MYSQL_PORT: process.env.MYSQL_PORT,
          PORT: process.env.PORT,
        },
      },
    ],
  };
  