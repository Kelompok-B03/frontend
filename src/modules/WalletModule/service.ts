import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Add authorization header to requests
const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getWalletBalance = async (userId: string) => {
  try {
    const response = await axios.get(`${API_URL}/wallet/balance?userId=${userId}`, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    throw error;
  }
};

export const getRecentTransactions = async (userId: string, limit: number) => {
  try {
    const response = await axios.get(
      `${API_URL}/wallet/transactions?userId=${userId}&limit=${limit}`,
      { headers: authHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching recent transactions:', error);
    throw error;
  }
};

export const getAllTransactions = async (userId: string, page = 0, size = 10) => {
  try {
    const response = await axios.get(
      `${API_URL}/wallet/transactions?userId=${userId}&page=${page}&size=${size}`,
      { headers: authHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    throw error;
  }
};

export const topUpWallet = async (userId: string, amount: number, paymentMethod: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/wallet/top-ups`,
      { userId, amount, paymentMethod },
      { headers: authHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error performing wallet top up:', error);
    throw error;
  }
};

export const getTransactionById = async (userId: string, transactionId: string) => {
  try {
    // We need to get this transaction from transactions endpoint since there's no direct API
    const response = await axios.get(
      `${API_URL}/wallet/transactions?userId=${userId}`,
      { headers: authHeader() }
    );
    
    const transaction = response.data.content?.find((tx: any) => tx.id === transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    
    return transaction;
  } catch (error) {
    console.error('Error fetching transaction details:', error);
    throw error;
  }
};

export const deleteTransaction = async (userId: string, transactionId: number) => {
  try {
    const response = await axios.delete(
      `${API_URL}/wallet/transactions/${transactionId}?userId=${userId}`,
      { headers: authHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};