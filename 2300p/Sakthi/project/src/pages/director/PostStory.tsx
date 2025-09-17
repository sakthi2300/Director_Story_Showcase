import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const PostStory: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaType, setMediaType] = useState<'video' | 'audio' | 'pdf'>();
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !mediaType || !mediaFile || genres.length === 0) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Handle form submission
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setMediaFile(file);
    }
  };

  const handleGenreChange = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-dark-lighter p-6 rounded-lg shadow-lg border border-primary/20">
          <h1 className="text-2xl font-bold text-white mb-6">Post a New Story</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-500/20 text-red-400 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                Story Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 bg-dark border border-primary/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                placeholder="Enter your story title"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 bg-dark border border-primary/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                placeholder="Describe your story..."
                required
              />
            </div>
            
            <div>
              <label htmlFor="mediaType" className="block text-sm font-medium text-gray-300 mb-1">
                Media Type
              </label>
              <select
                id="mediaType"
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value as 'video' | 'audio' | 'pdf')}
                className="w-full px-4 py-2 bg-dark border border-primary/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                required
              >
                <option value="">Select media type</option>
                <option value="video">Video</option>
                <option value="audio">Audio</option>
                <option value="pdf">PDF</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="mediaFile" className="block text-sm font-medium text-gray-300 mb-1">
                Upload Media
              </label>
              <input
                type="file"
                id="mediaFile"
                onChange={handleFileChange}
                className="w-full px-4 py-2 bg-dark border border-primary/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                accept={mediaType === 'video' ? 'video/*' : mediaType === 'audio' ? 'audio/*' : '.pdf'}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Genres
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {genres.map((genre) => (
                  <label key={genre} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedGenres.includes(genre)}
                      onChange={() => handleGenreChange(genre)}
                      className="h-4 w-4 text-primary focus:ring-primary border-primary/20 rounded bg-dark"
                    />
                    <span className="text-gray-300">{genre}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/director/dashboard')}
                className="px-6 py-2 border border-primary/20 rounded-lg text-white hover:bg-primary/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Post Story'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default PostStory; 