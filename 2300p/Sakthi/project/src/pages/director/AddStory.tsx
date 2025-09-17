import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import { Genre } from '../../types';

const AddStory: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mediaType: 'video' as 'video' | 'audio' | 'pdf',
    genres: [] as Genre[],
    mediaFile: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        mediaFile: file
      }));
    }
  };
  
  const handleGenreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      genres: checked 
        ? [...prev.genres, value as Genre]
        : prev.genres.filter(genre => genre !== value)
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in to create a story');
      return;
    }

    if (!formData.title || !formData.description || formData.genres.length === 0 || !formData.mediaFile) {
      setError('Please fill in all required fields and upload a media file');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('User:', user);
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('mediaType', formData.mediaType);
      formDataToSend.append('genres', JSON.stringify(formData.genres));
      formDataToSend.append('media', formData.mediaFile);
      formDataToSend.append('directorId', user?.id || '');
      formDataToSend.append('directorName', user?.name || '');
      formDataToSend.append('directorEmail', user?.email || '');
      formDataToSend.append('directorPhone', user?.phone || '');
      formDataToSend.append('directorBio', user?.bio || '');

      console.log('FormData to send:', formDataToSend);
      console.log('DirectorId:', user?.id);

      const response = await fetch('http://localhost:3001/api/stories', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload story');
      }

      const data = await response.json();
      console.log('Story uploaded successfully:', data);
      
      // Redirect to dashboard
      navigate('/director/dashboard');
    } catch (err) {
      setError('Failed to create story. Please try again.');
      console.error('Error creating story:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-dark-lighter p-6 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-white mb-6">Add New Story</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                Story Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-primary/20 bg-dark text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your story title"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                Story Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-primary/20 bg-dark text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Describe your story"
              />
            </div>
            
            <div>
              <label htmlFor="mediaType" className="block text-sm font-medium text-gray-300 mb-1">
                Media Type
              </label>
              <select
                id="mediaType"
                name="mediaType"
                required
                value={formData.mediaType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-primary/20 bg-dark text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="video">Video</option>
                <option value="audio">Audio</option>
                <option value="pdf">PDF</option>
              </select>
            </div>

            <div>
              <label htmlFor="mediaFile" className="block text-sm font-medium text-gray-300 mb-1">
                Upload Media File
              </label>
              <input
                type="file"
                id="mediaFile"
                name="mediaFile"
                required
                accept={
                  formData.mediaType === 'video' 
                    ? 'video/*' 
                    : formData.mediaType === 'audio' 
                    ? 'audio/*' 
                    : '.pdf'
                }
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-primary/20 bg-dark text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
              />
              {formData.mediaFile && (
                <p className="mt-2 text-sm text-gray-400">
                  Selected file: {formData.mediaFile.name}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Genres
              </label>
              <div className="grid grid-cols-2 gap-4">
                {(['Action', 'Drama', 'Comedy', 'Thriller', 'Romance', 'Horror', 'Documentary'] as Genre[]).map(genre => (
                  <label key={genre} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={genre}
                      checked={formData.genres.includes(genre)}
                      onChange={handleGenreChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-primary/20 rounded bg-dark"
                    />
                    <span className="text-gray-300">{genre}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {error && (
              <div className="p-4 bg-red-900/20 border border-red-500/20 rounded-md">
                <p className="text-red-400">{error}</p>
              </div>
            )}
            
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/director/dashboard')}
                className="px-4 py-2 border border-primary/20 rounded-md text-gray-300 hover:bg-primary/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              >
                {loading ? 'Creating...' : 'Create Story'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddStory;