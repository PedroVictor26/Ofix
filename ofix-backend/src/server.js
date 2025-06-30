import app from './app';
import 'dotenv/config'; // Carrega variáveis de ambiente do .env

const port = process.env.PORT || 3333;

app.listen(port, () => {
  console.log(`🚀 OFIX Backend rodando na porta ${port}`);
});
