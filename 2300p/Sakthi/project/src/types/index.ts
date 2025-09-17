export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'director' | 'producer';
  password?: string;
}

export interface Director extends User {
  role: 'director';
  bio: string;
  stories: Story[];
}

export interface Producer extends User {
  role: 'producer';
  bio: string;
}

export type Genre = 
  | 'Action'
  | 'Adventure'
  | 'Comedy'
  | 'Drama'
  | 'Fantasy'
  | 'Horror'
  | 'Mystery'
  | 'Romance'
  | 'Sci-Fi'
  | 'Thriller'
  | 'Documentary'
  | 'Animation'
  | 'Biography'
  | 'Crime'
  | 'Family'
  | 'Historical'
  | 'Musical'
  | 'War'
  | 'Western';

export interface Story {
  id: string;
  directorId: string;
  title: string;
  description: string;
  mediaType: 'audio' | 'video' | 'pdf';
  mediaUrl: string;
  genres: Genre[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}