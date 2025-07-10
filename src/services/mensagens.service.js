import apiClient from './api';

export const createMensagem = async (mensagemData) => {
    try {
        const response = await apiClient.post('/mensagens', mensagemData);
        return response.data;
    } catch (error) {
        console.error("Erro ao criar mensagem:", error);
        throw error;
    }
};

export const updateMensagem = async (id, mensagemData) => {
    try {
        const response = await apiClient.put(`/mensagens/${id}`, mensagemData);
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar mensagem:", error);
        throw error;
    }
};

export const getMensagens = async () => {
    try {
        const response = await apiClient.get('/mensagens');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar mensagens:", error);
        throw error;
    }
};

export const deleteMensagem = async (id) => {
    try {
        const response = await apiClient.delete(`/mensagens/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao deletar mensagem:", error);
        throw error;
    }
};