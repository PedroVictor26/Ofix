import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3333/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Requisição: Adiciona o token JWT a cada requisição
apiClient.interceptors.request.use(
  (config) => {
    // Tenta obter o token do localStorage (ou de onde quer que ele seja armazenado após o login)
    // O ideal é que o token seja armazenado de forma segura.
    // Para este exemplo, vamos assumir que o token é armazenado como 'authToken'.
    const tokenDataString = localStorage.getItem('ofixUserToken'); // Chave onde o token é guardado

    if (tokenDataString) {
      try {
        const tokenData = JSON.parse(tokenDataString); // Supondo que guardamos { user, token }
        if (tokenData && tokenData.token) {
          config.headers.Authorization = `Bearer ${tokenData.token}`;
        }
      } catch (e) {
        console.error("Erro ao parsear token do localStorage", e);
        // Lidar com token malformado, talvez limpando-o
        localStorage.removeItem('ofixUserToken');
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Resposta: (Opcional, mas útil para tratamento global de erros)
// Exemplo: Redirecionar para login se receber 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        // Token inválido ou expirado.
        // Limpar dados de autenticação local e redirecionar para login.
        console.warn("Erro 401: Não autorizado. Limpando token e redirecionando para login.");
        localStorage.removeItem('ofixUserToken'); // Limpa o token
        // Idealmente, aqui você usaria o sistema de roteamento para navegar para a página de login.
        // Ex: window.location.href = '/login'; (Isso recarregaria a página)
        // Ou, se tiver acesso ao history do react-router-dom, usá-lo.
        // Em um app mais complexo, um evento/callback poderia ser disparado para o AuthContext lidar com isso.
        // Por enquanto, apenas logamos e removemos o token.
      } else if (status === 403) {
        console.warn("Erro 403: Acesso proibido.");
        // Poderia mostrar uma notificação global de "acesso negado".
      } else {
        // Outros erros de resposta (4xx, 5xx)
        // O erro será tratado localmente pela chamada que o originou.
        // console.error(`Erro ${status}:`, data?.error?.message || data?.error || data);
      }
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta (ex: erro de rede)
      console.error('Erro de rede ou servidor não respondeu:', error.message);
    } else {
      // Algo aconteceu ao configurar a requisição que disparou um erro
      console.error('Erro ao configurar requisição:', error.message);
    }
    return Promise.reject(error); // Importante para que o erro continue sendo propagado
  }
);

export default apiClient;
