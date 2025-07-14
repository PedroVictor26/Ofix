import apiClient from './api';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getAllClientes = async (retryCount = 0) => {
  try {
    const response = await apiClient.get('/clientes');
    return response.data;
  } catch (error) {
    console.log('Erro ao buscar clientes:', error.response?.data || error.message);
    
    if (retryCount < MAX_RETRIES && error.response?.status === 500) {
      console.log(`Tentativa ${retryCount + 1} de ${MAX_RETRIES} em ${RETRY_DELAY}ms...`);
      await sleep(RETRY_DELAY);
      return getAllClientes(retryCount + 1);
    }
    
    throw error;
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

export const createVeiculo = async (clienteId, veiculoData) => {
  if (!clienteId || !veiculoData) throw new Error("ID do cliente e dados do veículo são obrigatórios.");
  try {
    const response = await apiClient.post(`/clientes/${clienteId}/veiculos`, veiculoData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar veículo:", error.response?.data?.error || error.message);
    throw error.response?.data || { message: error.message || "Erro desconhecido ao criar veículo." };
  }
};

export const getAllVeiculos = async () => {
  try {
    const response = await apiClient.get('/veiculos'); // Assumindo que você tem uma rota /veiculos no backend
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar veículos:", error.response?.data?.error || error.message);
    throw error.response?.data || { message: error.message || "Erro desconhecido ao buscar veículos." };
  }
};
