import backendAxiosInstance from '@/utils/backendAxiosInstance';

interface TransactionData {
  id?: number | string;
  type: string;
  description: string;
  timestamp: string;
  amount: number;
  status?: string;
  paymentMethod?: string;
  campaignId?: string;
  reference?: string;
  [key: string]: unknown;
}

// Backend transaction structure
interface BackendTransaction {
  id: number | string;
  type: string;
  description: string;
  timestamp: string;
  amount: number;
  paymentMethod?: string;
  campaignId?: string;
  [key: string]: unknown;
}

export const getWalletBalance = async (userId: string) => {
  try {
    const response = await backendAxiosInstance.get(`/api/wallet/balance?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    throw error;
  }
};

export const getRecentTransactions = async (userId: string, limit: number) => {
  try {
    const response = await backendAxiosInstance.get(
      `/api/wallet/transactions?userId=${userId}&limit=${limit}`);
    return response.data.map(mapTransactionType);
  } catch (error) {
    console.error('Error fetching recent transactions:', error);
    throw error;
  }
};

export const getAllTransactions = async (userId: string, page = 0, size = 10) => {
  try {
    const response = await backendAxiosInstance.get(
      `/api/wallet/transactions?userId=${userId}&page=${page}&size=${size}`);
    
    const mappedContent = response.data.content.map(mapTransactionType);
    
    return {
      ...response.data,
      content: mappedContent
    };
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    throw error;
  }
};

export const topUpWallet = async (userId: string, amount: number, paymentMethod: string, paymentPhone: string) => {
  try {
    const response = await backendAxiosInstance.post(
      `/api/wallet/top-ups`,
      { 
        userId, 
        amount, 
        paymentMethod, 
        paymentPhone 
      });
    return response.data;
  } catch (error) {
    console.error('Error performing wallet top up:', error);
    throw error;
  }
};

export const getTransactionById = async (userId: string, transactionId: string) => {
  try {
    const response = await backendAxiosInstance.get(
      `/api/wallet/transactions?userId=${userId}`);
    
    const transaction = response.data.content?.find((tx: BackendTransaction) => tx.id.toString() === transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    
    return mapTransactionType(transaction);
  } catch (error: unknown) {
    console.error('Error fetching transaction details:', error);
    throw error;
  }
};

export const getTransactionsByType = async (userId: string, type: string) => {
  try {
    const response = await backendAxiosInstance.get(
      `/api/wallet/transactions?userId=${userId}&type=${type.toUpperCase()}`);
    return response.data.map(mapTransactionType);
  } catch (error) {
    console.error('Error fetching transactions by type:', error);
    throw error;
  }
};

export const deleteTransaction = async (userId: string, transactionId: number) => {
  try {
    const response = await backendAxiosInstance.delete(
      `/api/wallet/transactions/${transactionId}?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};

// Helper function to map backend transaction types to frontend types
const mapTransactionType = (transaction: TransactionData) => {
  let mappedType;
  let displayDescription = transaction.description;
  
  switch (transaction.type) {
    case 'TOP_UP':
      mappedType = 'DEPOSIT';
      break;
    case 'DONATION':
      mappedType = 'WITHDRAWAL';
      displayDescription = `Donation to Campaign #${transaction.campaignId}`;
      break;
    case 'WITHDRAWAL':
      mappedType = 'DEPOSIT'; // Campaign fund withdrawal adds money to wallet
      displayDescription = `Campaign Funds from #${transaction.campaignId}`;
      break;
    default:
      mappedType = transaction.type;
  }

  return {
    ...transaction,
    type: mappedType,
    description: displayDescription,
    createdAt: transaction.timestamp,
    status: 'COMPLETED',
    reference: transaction.id?.toString(),
    paymentMethod: transaction.paymentMethod || undefined,
    campaignId: transaction.campaignId || undefined,
    originalType: transaction.type
  };
};