const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

if (process.env.ENV === 'dev' && fs.existsSync(path.resolve(__dirname, '.env.development'))) {
  dotenv.config({
    path: path.resolve(__dirname, '.env.development'),
    override: true
  });
} else {
  dotenv.config();
}

['JWT_SECRET', 'CHANGE_PASSWORD_SECRET'].forEach(name => {
  if (!process.env[name]) throw new Error(`${name} is required`);
});

const app = require('./app');

// Connect to the configured MongoDB instance before accepting requests.
require('./db/connect');

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server running on port ${process.env.PORT || 4000}`);
});
