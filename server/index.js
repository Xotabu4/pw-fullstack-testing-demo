require('dotenv').config();
const express = require('express');
const chalk = require('chalk');
const compression = require('compression');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');

const keys = require('./config/keys');
const routes = require('./routes');
const socket = require('./socket');
const setupDB = require('./utils/db');
const swaggerUi = require('swagger-ui-express');
const openapiSpec = require('./docs/openapi');

const { port } = keys;
const app = express();
const distPath = path.resolve(__dirname, '../dist');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: false,
    frameguard: true
  })
);
app.use(cors());

setupDB();
require('./config/passport')(app);

// OpenAPI must be registered before static files and the SPA fallback
app.get('/api-docs.json', (req, res) => {
  res.json(openapiSpec);
});
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(openapiSpec, {
    customSiteTitle: 'MERN Ecommerce API Docs',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true
    }
  })
);

app.use(express.static(distPath));
app.use(routes);

console.log('process.env.NODE_ENV ', process.env.NODE_ENV);
if (process.env.NODE_ENV === 'production') {
  app.use(compression());
  app.get('*', (req, res, next) => {
    if (req.path === '/api-docs' || req.path.startsWith('/api-docs/')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const server = app.listen(port, () => {
  console.log(
    `${chalk.green('✓')} ${chalk.blue(
      `Listening on port ${port}. Visit http://localhost:${port}/ in your browser.`
    )}`
  );
  console.log(
    `${chalk.green('✓')} ${chalk.blue(
      `API docs: http://localhost:${port}/api-docs  |  http://localhost:${port}/api-docs.json`
    )}`
  );
});

socket(server);
