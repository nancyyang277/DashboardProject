import express from 'express';
import routes from './routes/index.js';
import cors from 'cors';

class Server {
  constructor() {
    this.app = express();
  }

  /**
   * initialize request and route middlewares.
   *
   * @returns {this}
   */
  initMiddlewares() {
    
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));

    // import and use routers
    Object.values(routes).forEach(router => {
      this.app.use(router);
    });

    this.app.get('/', (req, res) => {
        res.status(200).json({
            message: 'welcome to my API'
        });
    });

    // 404 response for unimplemented routes
    this.app.use(function(req, res) {
      res.status(404);
      res.json({
        status: 404,
        message: 'Unknown API route'
      });
    });

    return this;
  }

  async init() {
    this.initMiddlewares();
  }

  /**
   * launch the app as an http server.
   *
   * @param {?number} port
   * @returns {Promise<*>}
   */
  async listen(port = 5000) {
    this.port = port;

    return new Promise((resolve, reject) => {
      try {
        this.server = this.app.listen(this.port, () => {
        //   logger.info(`Server running on port ${this.port}`);
          resolve(this.server);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * shut down the currently running server instance.
   *
   * @returns {Promise<void>}
   */
  async close() {
    if (this.server !== undefined) {
      try {
        await this.server.close();
      } catch (error) {
      }
    }
  }
  
}

export default Server;