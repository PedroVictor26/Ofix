import apiClient from './api';

export const getAllClientes = async () => {
  try {
    const response = await apiClient.get('/clientes');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar clientes:", error.response?.data?.error || error.message);
    throw error.response?.data || { message: error.message || "Erro desconhecido ao buscar clientes." };
  }
};

export const getClienteById = async (id) => {
  if (!id) throw new Error("ID do cliente é obrigatório.");
  try {
    const response = await apiClient.get(`/clientes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar cliente com ID ${id}:`, error.response?.data?.error || error.message);
    throw error.response?.data || { message: error.message || `Erro ao buscar cliente ${id}.` };
  }
};

export const createCliente = async (clienteData) => {
  if (!clienteData) throw new Error("Dados do cliente são obrigatórios.");
  try {
    const response = await apiClient.post('/clientes', clienteData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar cliente:", error.response?.data?.error || error.message);
    throw error.response?.data || { message: error.message || "Erro desconhecido ao criar cliente." };
  }
};

export const updateCliente = async (id, updateData) => {
  if (!id || !updateData) throw new Error("ID e dados de atualização são obrigatórios.");
  try {
    const response = await apiClient.put(`/clientes/${id}`, updateData);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar cliente com ID ${id}:`, error.response?.data?.error || error.message);
    throw error.response?.data || { message: error.message || `Erro ao atualizar cliente ${id}.` };
  }
};

export const deleteCliente = async (id) => {
  if (!id) throw new Error("ID do cliente é obrigatório.");
  try {
    const response = await apiClient.delete(`/clientes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao deletar cliente com ID ${id}:`, error.response?.data?.error || error.message);
    throw error.response?.data || { message: error.message || `Erro ao deletar cliente ${id}.` };
  }
};
