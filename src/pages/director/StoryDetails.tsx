import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import { mockStories } from '../../data/mockData';
import { Story, Genre } from '../../types';

const StoryDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedStory, setEditedStory] = useState<Partial<Story>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [newStatus, setNewStatus] = useState<'approved' | 'rejected'>('approved');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchStory = async () => {
      try {
        // Simulate API call
        const foundStory = mockStories.find(s => s.id === id);
        if (foundStory) {
          setStory(foundStory);
        } else {
          setError('Story not found');
        }
      } catch (err) {
        setError('Failed to fetch story');
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [id]);

  const renderMediaPlayer = () => {
    if (!story) return null;

    const mediaType = story.mediaType;
    const mediaUrl = story.mediaUrl;

    if (!mediaUrl) {
      return <p className="text-gray-400">No media available</p>;
    }

    // Check if the URL is a base64 string
    const isBase64 = mediaUrl.startsWith('data:');
    const fileExtension = mediaUrl.split('.').pop()?.toLowerCase();

    switch (mediaType) {
      case 'video':
        return (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
            <video 
              controls 
              className="w-full h-full"
              src={mediaUrl}
              controlsList="nodownload"
              preload="metadata"
              style={{ display: 'block' }}
            >
              <source src={mediaUrl} type={`video/${fileExtension || 'mp4'}`} />
              Your browser does not support the video tag.
            </video>
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white text-sm">
              Click the play button in the center to start playback
            </div>
          </div>
        );
      case 'audio':
        return (
          <div className="w-full p-4 bg-dark rounded-lg">
            <div className="mb-2 text-white text-sm">Audio Player</div>
            <audio 
              controls 
              className="w-full"
              src={mediaUrl}
              controlsList="nodownload"
              preload="metadata"
              style={{ display: 'block' }}
            >
              <source src={mediaUrl} type={`audio/${fileExtension || 'mp3'}`} />
              Your browser does not support the audio tag.
            </audio>
            <div className="mt-2 text-gray-400 text-sm">
              Click the play button to start playback
            </div>
          </div>
        );
      case 'pdf':
        return (
          <div className="w-full h-[600px] rounded-lg overflow-hidden bg-white">
            <iframe
              src={mediaUrl}
              className="w-full h-full"
              title="PDF Viewer"
            />
          </div>
        );
      default:
        return <p className="text-gray-400">Unsupported media type</p>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-dark-lighter rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-dark-lighter rounded w-1/2 mb-8"></div>
            <div className="h-96 bg-dark-lighter rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-dark-lighter rounded w-full"></div>
              <div className="h-4 bg-dark-lighter rounded w-5/6"></div>
              <div className="h-4 bg-dark-lighter rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="min-h-screen bg-dark">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-400 mb-2">Error</h2>
            <p className="text-gray-300">{error || 'Story not found'}</p>
            <button
              onClick={() => navigate('/director/dashboard')}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-dark-lighter rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-2">{story.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-400 mb-6">
              <span>Posted {new Date(story.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span>{story.mediaType}</span>
            </div>
            
            <div className="mb-6">
              {renderMediaPlayer()}
            </div>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300">{story.description}</p>
            </div>
            
            <div className="mt-6 flex flex-wrap gap-2">
              {story.genres?.map(genre => (
                <span
                  key={genre}
                  className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
          
          <div className="border-t border-primary/20 p-6">
            <div className="flex justify-between items-center">
              <button
                onClick={() => navigate('/director/dashboard')}
                className="px-4 py-2 border border-primary/20 rounded-md text-gray-300 hover:bg-primary/10 transition-colors"
              >
                Back to Dashboard
              </button>
              
              <button
                onClick={() => navigate(`/director/stories/${story.id}/edit`)}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              >
                Edit Story
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StoryDetails; 