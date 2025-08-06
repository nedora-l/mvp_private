import apiClient from '../api-client';
import { AppEmployee, AppEmployeeSearchFilterDtro } from '@/lib/interfaces/apis';
import { ApiResponse } from '@/lib/interfaces/apis/common';
import { getStoredToken } from '@/lib/services/auth/token-storage';

const DIRECTORY_BASE_PATH = '/directory'; 

export const getEmployeesClientApi = async (params?: AppEmployeeSearchFilterDtro): Promise<ApiResponse<AppEmployee[]>> => {
  const token =  getStoredToken();
  return  apiClient<ApiResponse<AppEmployee[]>>(DIRECTORY_BASE_PATH, {
    method: 'GET',
    params,
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    }
  });
};
