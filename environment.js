const env = process.env.ENVIRONMENT;

const environment = {
  development: {
    api: 'http://localhost:3030',
  },
  production: {
    api: 'http://localhost:3030',
  },

}[env];

export default environment;
