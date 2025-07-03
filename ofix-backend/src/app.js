import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import routes from './routes/index.js';

class Application {
  constructor() {
    this.server = express();
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandler();
  }

  setupMiddlewares() {
    // --- INÍCIO DA CORREÇÃO DO CORS ---

    // 1. Defina quais "origens" (sites) têm permissão para acessar sua API
    const allowedOrigins = [
      'https://ofix.vercel.app',  // URL de produção do seu frontend
      'http://localhost:5173',   // URL para desenvolvimento local com Vite
      'http://localhost:3000'    // Outra URL comum para desenvolvimento local
    ];

    // 2. Crie as opções do CORS
    const corsOptions = {
      origin: (origin, callback) => {
        // Permite requisições sem 'origin' (ex: Postman) ou da lista de permissões
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos permitidos
      credentials: true, // Se precisar enviar cookies ou headers de autorização
    };

    // 3. Use o middleware CORS com as opções configuradas
    this.server.use(cors(corsOptions));

    // --- FIM DA CORREÇÃO DO CORS ---

    this.server.use(express.json());
    this.server.use((req, res, next) => {
      console.log(`Requisição recebida: ${req.method} ${req.url}`);
      next();
    });
  }

  setupRoutes() {
    this.server.use('/api', routes);
    this.server.get('/', (req, res) => {
      res.json({ message: 'Bem-vindo à API OFIX!' });
    });
  }

  setupErrorHandler() {
    this.server.use((err, req, res, next) => {
      console.error(err.stack);
      if (res.headersSent) {
        return next(err);
      }
      res.status(err.status || 500).json({
        error: {
          message: err.message || 'Ocorreu um erro interno no servidor.',
          ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
        },
      });
    });
  }
}

export default new Application().server;