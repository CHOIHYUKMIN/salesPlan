import axios from 'axios';

const API_URL = 'http://localhost:4000/api/year-plans';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
};

export interface CreateKpiDto {
    name: string;
    target: number;
    unit: string;
}

export interface CreateYearPlanDto {
    year: number;
    title: string;
    description?: string;
    kpis?: CreateKpiDto[];
}

export interface UpdateYearPlanDto {
    title?: string;
    description?: string;
    kpis?: CreateKpiDto[];
}

export const yearPlansApi = {
    getAll: async (filters?: { year?: number; status?: string; userId?: string }) => {
        const response = await axios.get(API_URL, {
            params: filters,
            headers: getAuthHeader(),
        });
        return response.data;
    },

    getOne: async (id: string) => {
        const response = await axios.get(`${API_URL}/${id}`, {
            headers: getAuthHeader(),
        });
        return response.data;
    },

    create: async (data: CreateYearPlanDto) => {
        const response = await axios.post(API_URL, data, {
            headers: getAuthHeader(),
        });
        return response.data;
    },

    update: async (id: string, data: UpdateYearPlanDto) => {
        const response = await axios.patch(`${API_URL}/${id}`, data, {
            headers: getAuthHeader(),
        });
        return response.data;
    },

    delete: async (id: string) => {
        const response = await axios.delete(`${API_URL}/${id}`, {
            headers: getAuthHeader(),
        });
        return response.data;
    },

    submit: async (id: string) => {
        const response = await axios.post(`${API_URL}/${id}/submit`, {}, {
            headers: getAuthHeader(),
        });
        return response.data;
    },

    approve: async (id: string) => {
        const response = await axios.post(`${API_URL}/${id}/approve`, {}, {
            headers: getAuthHeader(),
        });
        return response.data;
    },

    reject: async (id: string) => {
        const response = await axios.post(`${API_URL}/${id}/reject`, {}, {
            headers: getAuthHeader(),
        });
        return response.data;
    }
};
