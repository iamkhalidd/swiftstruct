const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export interface Property {
  id: string;
  title: string;
  slug: string;
  reference: string;
  description: string;
  propertyType: string;
  listingType: 'SALE' | 'RENT';
  price: number;
  currency: string;
  location: string;
  city: string;
  state: string;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  status: string;
  isFeatured: boolean;
  amenities?: string;
  features?: string;
  publishedAt?: string;
  images: { id: string; url: string; caption?: string; isPrimary?: boolean }[];
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  reference: string;
  description: string;
  location: string;
  projectType: string;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'ARCHIVED';
  scope?: string;
  services?: string;
  progressPercent: number;
  startDate?: string;
  completionDate?: string;
  isFeatured: boolean;
  publishedAt?: string;
  images: { id: string; url: string; caption?: string; isPrimary?: boolean }[];
}

export interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  content: string;
  imageUrl?: string;
  features?: string;
  isPublished: boolean;
}

export interface InsightArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  category: string;
  author: string;
  publishedAt?: string;
}

export interface EnquiryPayload {
  type: 'PROPERTY' | 'PROJECT_BRIEF' | 'CONSULTANCY' | 'GENERAL';
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
  budget?: string;
  projectType?: string;
  location?: string;
  serviceRequested?: string;
  propertyId?: string;
  projectId?: string;
  serviceId?: string;
}

async function fetcher<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => null);
      const detail =
        errData?.message ??
        `HTTP ${res.status}${res.statusText ? ` ${res.statusText}` : ''} from ${url}`;
      throw new Error(detail);
    }
    return await res.json();
  } catch (err: any) {
    throw new Error(err.message || 'Network request failed');
  }
}

export const api = {
  properties: {
    getAll: async (params?: Record<string, any>) => {
      const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
      return fetcher<{ data: Property[]; total: number; page: number; totalPages: number }>(`/properties${query}`);
    },
    getBySlug: async (slug: string) => {
      return fetcher<Property>(`/properties/${slug}`);
    },
  },
  projects: {
    getAll: async (params?: Record<string, any>) => {
      const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
      return fetcher<{ data: Project[]; total: number; page: number; totalPages: number }>(`/projects${query}`);
    },
    getBySlug: async (slug: string) => {
      return fetcher<Project>(`/projects/${slug}`);
    },
  },
  services: {
    getAll: async () => {
      return fetcher<ServiceItem[]>('/services');
    },
    getBySlug: async (slug: string) => {
      return fetcher<ServiceItem>(`/services/${slug}`);
    },
  },
  insights: {
    getAll: async () => {
      return fetcher<InsightArticle[]>('/insights');
    },
    getBySlug: async (slug: string) => {
      return fetcher<InsightArticle>(`/insights/${slug}`);
    },
  },
  enquiries: {
    create: async (payload: EnquiryPayload) => {
      return fetcher<{ message: string; id?: string }>('/enquiries', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
  },
};
