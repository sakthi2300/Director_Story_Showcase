import { Director, Producer, Story } from '../types';

export const mockStories: Story[] = [
  {
    id: 'story-1',
    directorId: 'director-1',
    title: 'Kaveri Oru Kadal',
    description: 'A poignant tale of love and sacrifice set against the backdrop of the Kaveri river, exploring the lives of fishermen and their families in a coastal village of Tamil Nadu.',
    mediaType: 'audio',
    mediaUrl: '/media/story1.mp3',
    genres: ['Drama', 'Family', 'Romance'],
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z'
  },
  {
    id: 'story-2',
    directorId: 'director-1',
    title: 'Malabar Mystery',
    description: 'A thrilling detective story set in the misty hills of Kerala, where a local police officer uncovers a series of mysterious disappearances connected to ancient temple rituals.',
    mediaType: 'video',
    mediaUrl: '/media/story2.mp4',
    genres: ['Mystery', 'Thriller', 'Crime'],
    createdAt: '2024-03-14T15:30:00Z',
    updatedAt: '2024-03-14T15:30:00Z'
  },
  {
    id: 'story-3',
    directorId: 'director-1',
    title: 'Karnataka Dreams',
    description: 'A heartwarming story about a young tech entrepreneur from Bangalore who returns to his ancestral village to bridge the digital divide and preserve traditional art forms.',
    mediaType: 'pdf',
    mediaUrl: '/media/story3.pdf',
    genres: ['Drama', 'Adventure', 'Family'],
    createdAt: '2024-03-13T09:15:00Z',
    updatedAt: '2024-03-13T09:15:00Z'
  }
];

export const mockDirectors: Director[] = [
  {
    id: 'director-1',
    name: 'Rajesh Kumar',
    email: 'director@example.com',
    phone: '9876543210',
    role: 'director',
    password: 'director123',
    bio: 'Award-winning filmmaker passionate about bringing South Indian stories to the global stage. Specializing in authentic narratives that celebrate our rich cultural heritage.'
  },
  {
    id: 'director-2',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '9876543211',
    role: 'director',
    password: 'priya123',
    bio: 'Independent filmmaker with a focus on women-centric stories and social issues.'
  },
  {
    id: 'director-3',
    name: 'Arun Menon',
    email: 'arun@example.com',
    phone: '9876543212',
    role: 'director',
    password: 'arun123',
    bio: 'Documentary filmmaker specializing in cultural heritage and environmental issues.'
  }
];

export const mockProducers: Producer[] = [
  {
    id: 'producer-1',
    name: 'John Smith',
    email: 'producer@example.com',
    phone: '9876543210',
    role: 'producer',
    password: 'producer123',
    bio: 'Experienced film producer with a passion for discovering new talent and bringing compelling stories to life.'
  },
  {
    id: 'producer-2',
    name: 'Meera Patel',
    email: 'meera@example.com',
    phone: '9876543213',
    role: 'producer',
    password: 'meera123',
    bio: 'Independent producer with a track record of successful regional cinema projects.'
  },
  {
    id: 'producer-3',
    name: 'Vikram Singh',
    email: 'vikram@example.com',
    phone: '9876543214',
    role: 'producer',
    password: 'vikram123',
    bio: 'Commercial film producer with expertise in marketing and distribution.'
  }
];