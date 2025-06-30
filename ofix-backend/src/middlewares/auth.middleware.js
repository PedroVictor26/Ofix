import jwt from 'jsonwebtoken';
import 'dotenv/config';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  // Este erro deve idealmente parar a aplicação na inicialização se JWT_SECRET não estiver definido.
  // Pode ser verificado no server.js ou app.js.
  console.error('FATAL ERROR: JWT_SECRET não está definido nas variáveis de ambiente.');
  // process.exit(1); // Em um cenário real, você pode querer parar a aplicação aqui.
}


export function protectRoute(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acesso não autorizado. Token não fornecido ou mal formatado.' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Acesso não autorizado. Token ausente após Bearer.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Anexa o payload decodificado do token ao objeto req.user
    // Isso normalmente inclui o ID do usuário, ID da oficina, papel, etc.
    req.user = {
        id: decoded.userId, // Renomeado de userId para id para consistência com o modelo User
        email: decoded.email,
        role: decoded.role,
        oficinaId: decoded.oficinaId,
        // ... outros campos do payload que você queira expor
    };
    next(); // Prossegue para a próxima função de middleware ou para o controller da rota
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado. Por favor, faça login novamente.' });
    }
    if (error.name === 'JsonWebTokenError') {
      // Isso pode incluir token malformado, assinatura inválida, etc.
      return res.status(401).json({ error: 'Token inválido.' });
    }
    // Para outros erros inesperados durante a verificação do token
    console.error("Erro ao verificar token:", error);
    return res.status(500).json({ error: 'Erro interno ao validar o token de autenticação.'});
  }
}
