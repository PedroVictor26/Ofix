import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import routes from './routes/index.js'; // Será criado a seguir

class Application {
  constructor() {
    this.server = express();
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandler(); // Básico, pode ser melhorado
  }

  setupMiddlewares() {
    this.server.use(cors()); // Em produção, configure origins específicos: cors({ origin: process.env.FRONTEND_URL })
    this.server.use(express.json()); // Para parsear JSON no corpo das requisições
  }

  setupRoutes() {
    this.server.use('/', routes); // Todas as rotas serão montadas na raiz
    this.server.get('/', (req, res) => { // Rota raiz para health check ou boas-vindas
      res.json({ message: 'Bem-vindo à API OFIX!' });
    });
  }

  setupErrorHandler() {
    this.server.use((err, req, res, next) => {
      console.error(err.stack);
      // Verifica se headers já foram enviados
      if (res.headersSent) {
        return next(err);
      }
      res.status(err.status || 500).json({
        error: {
          message: err.message || 'Ocorreu um erro interno no servidor.',
          // Em desenvolvimento, pode-se adicionar err.stack
          ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
      });
    });
  }
}

export default new Application().server;
