import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, User, Mail, Phone } from 'lucide-react';
import { Story, Genre } from '../types';
import { useAuth } from '../context/AuthContext';

interface StoryListProps {
  searchTerm?: string;
  mediaTypeFilter?: 'all' | 'video' | 'audio' | 'pdf';
  genreFilter?: string;
  directorIdFilter?: string;
  onDirectorClick?: (directorId: string) => void;
}

const StoryList: React.FC<StoryListProps> = ({ 
  searchTerm = '', 
  mediaTypeFilter = 'all',
  genreFilter = '',
  directorIdFilter = '',
  onDirectorClick
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStories = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/stories');
      if (!response.ok) {
        throw new Error('Failed to fetch stories');
      }
      const data = await response.json();
      
      // Filter stories based on user role and filters
      let filteredStories = data;
      
      // Filter by director if user is a director
      if (user?.role === 'director') {
        filteredStories = data.filter((story: Story) => story.directorId === user.id);
      }
      
      // Apply search and filters
      filteredStories = filteredStories.filter((story: Story) => {
        // Search term matching (case-insensitive)
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = searchTerm === '' || 
          story.title.toLowerCase().includes(searchLower) ||
          story.description.toLowerCase().includes(searchLower) ||
          (story.director?.name?.toLowerCase().includes(searchLower) ?? false) ||
          (story.director?.email?.toLowerCase().includes(searchLower) ?? false);
          
        // Media type matching
        const matchesMediaType = mediaTypeFilter === 'all' || story.mediaType === mediaTypeFilter;
        
        // Genre matching (case-insensitive)
        const matchesGenre = genreFilter === '' || 
          story.genres.some(genre => genre.toLowerCase() === (genreFilter as Genre).toLowerCase());
        
        // Director ID matching
        const matchesDirector = directorIdFilter === '' || story.directorId === directorIdFilter;
        
        return matchesSearch && matchesMediaType && matchesGenre && matchesDirector;
      });
      
      // Sort stories by creation date (newest first)
      filteredStories.sort((a: Story, b: Story) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setStories(filteredStories);
      setError(null);
    } catch (err) {
      setError('Failed to fetch stories. Please try again later.');
      console.error('Error fetching stories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [user, searchTerm, mediaTypeFilter, genreFilter, directorIdFilter]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/stories/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete story');
      }

      // Refresh the stories list
      fetchStories();
    } catch (err) {
      console.error('Error deleting story:', err);
      setError('Failed to delete story. Please try again later.');
    }
  };

  const renderMediaPlayer = (story: Story) => {
    if (!story.mediaUrl) return null;
    
    const mediaUrl = `http://localhost:3000${story.mediaUrl}`;
    
    if (story.mediaType === 'video') {
      return (
        <video 
          controls 
          className="w-full h-48 object-cover rounded-t-lg"
          src={mediaUrl}
        >
          Your browser does not support the video tag.
        </video>
      );
    } else if (story.mediaType === 'audio') {
      return (
        <audio 
          controls 
          className="w-full"
          src={mediaUrl}
        >
          Your browser does not support the audio tag.
        </audio>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="text-center text-gray-400 p-8">
        {user?.role === 'director' 
          ? "You haven't uploaded any stories yet. Click 'Add New Story' to get started!"
          : "No stories found matching your criteria. Try adjusting your filters."}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stories.map((story) => (
        <div key={story.id} className="bg-dark-lighter rounded-lg shadow-lg overflow-hidden">
          {renderMediaPlayer(story)}
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-white">{story.title}</h3>
              {user?.role === 'director' && (
                <button
                  onClick={() => handleDelete(story.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
            <p className="text-gray-300 mb-4">{story.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {story.genres.map((genre) => (
                <span
                  key={genre}
                  className="px-2 py-1 bg-primary/20 text-primary text-sm rounded-full"
                >
                  {genre}
                </span>
              ))}
            </div>
            {user?.role === 'producer' && story.director && (
              <div className="text-sm text-gray-400">
                <div className="flex items-center gap-2 mb-2">
                  <User size={16} className="text-primary" />
                  <button
                    onClick={() => onDirectorClick?.(story.directorId)}
                    className="text-primary hover:text-primary-light transition-colors"
                  >
                    Director ID: {story.directorId}
                  </button>
                </div>
                <div className="pl-6 space-y-1">
                  <p className="text-white font-medium">{story.director.name}</p>
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-primary" />
                    <a href={`mailto:${story.director.email}`} className="text-primary hover:text-primary-light">
                      {story.director.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-primary" />
                    <a href={`tel:${story.director.phone}`} className="text-primary hover:text-primary-light">
                      {story.director.phone}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StoryList; 