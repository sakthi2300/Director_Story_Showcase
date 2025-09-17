export type Genre = 
  | 'Action' | 'Adventure' | 'Comedy' | 'Drama' | 'Fantasy' | 'Horror'
  | 'Mystery' | 'Romance' | 'Sci-Fi' | 'Thriller' | 'Documentary'
  | 'Animation' | 'Biography' | 'Crime' | 'Family' | 'Historical'
  | 'Musical' | 'War' | 'Western';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'director' | 'producer';
  bio?: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface Director extends User {
  role: 'director';
  portfolio?: string[];
  experience?: string;
  awards?: string[];
}

export interface Producer extends User {
  role: 'producer';
  company?: string;
  projects?: string[];
}

export interface Story {
  id: string;
  title: string;
  description: string;
  mediaType: 'video' | 'audio' | 'pdf';
  mediaUrl: string;
  genres: Genre[];
  createdAt: string;
  updatedAt: string;
  directorId: string;
  director?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    bio?: string;
  };
} 