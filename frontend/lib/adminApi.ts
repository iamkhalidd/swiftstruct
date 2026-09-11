const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('ss_admin_token');
  }
  return null;
}

export function setAuthToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ss_admin_token', token);
  }
}

export function removeAuthToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('ss_admin_token');
    localStorage.removeItem('ss_admin_user');
  }
}

async function adminFetcher<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = getAuthToken();
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(url, { ...options, headers });
  } catch {
    // fetch() rejects on network failure or when CORS blocks the response
    throw new Error(`Cannot reach the API at ${API_BASE_URL} (network or CORS failure)`);
  }

  if (!res.ok) {
    const errData = await res.json().catch(() => null);
    const detail =
      errData?.message ??
      `HTTP ${res.status}${res.statusText ? ` ${res.statusText}` : ''} from ${url}`;
    throw new Error(detail);
  }
  return await res.json();
}

export const adminApi = {
  auth: {
    login: async (email: string, password: string) => {
      const data = await adminFetcher<{ accessToken: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setAuthToken(data.accessToken);
      if (typeof window !== 'undefined') {
        localStorage.setItem('ss_admin_user', JSON.stringify(data.user));
      }
      return data;
    },
    getProfile: async () => {
      return adminFetcher<any>('/auth/profile');
    },
  },
  properties: {
    getAll: async () => {
      return adminFetcher<{ data: any[]; total: number }>('/properties?limit=100');
    },
    create: async (data: any) => {
      return adminFetcher<any>('/properties', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    update: async (id: string, data: any) => {
      return adminFetcher<any>(`/properties/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
    delete: async (id: string) => {
      return adminFetcher<any>(`/properties/${id}`, {
        method: 'DELETE',
      });
    },
  },
  projects: {
    getAll: async () => {
      return adminFetcher<{ data: any[]; total: number }>('/projects?limit=100');
    },
    create: async (data: any) => {
      return adminFetcher<any>('/projects', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    update: async (id: string, data: any) => {
      return adminFetcher<any>(`/projects/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
    delete: async (id: string) => {
      return adminFetcher<any>(`/projects/${id}`, {
        method: 'DELETE',
      });
    },
  },
  enquiries: {
    getAll: async () => {
      return adminFetcher<any[]>('/enquiries');
    },
    updateStatus: async (id: string, status: string) => {
      return adminFetcher<any>(`/enquiries/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    },
  },
  insights: {
    getAll: async () => {
      return adminFetcher<any[]>('/insights');
    },
    create: async (data: any) => {
      return adminFetcher<any>('/insights', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    delete: async (id: string) => {
      return adminFetcher<any>(`/insights/${id}`, {
        method: 'DELETE',
      });
    },
  },
  testimonials: {
    getAll: async () => {
      return adminFetcher<any[]>('/testimonials');
    },
    create: async (data: any) => {
      return adminFetcher<any>('/testimonials', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    delete: async (id: string) => {
      return adminFetcher<any>(`/testimonials/${id}`, {
        method: 'DELETE',
      });
    },
  },
  services: {
    getAll: async () => {
      return adminFetcher<any[]>('/services');
    },
    update: async (id: string, data: any) => {
      return adminFetcher<any>(`/services/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
  },
  users: {
    getAll: async () => {
      return adminFetcher<any[]>('/users');
    },
    create: async (data: any) => {
      return adminFetcher<any>('/users', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    delete: async (id: string) => {
      return adminFetcher<any>(`/users/${id}`, {
        method: 'DELETE',
      });
    },
  },
};
