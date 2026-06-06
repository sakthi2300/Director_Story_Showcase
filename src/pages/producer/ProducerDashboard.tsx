import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, UserCircle, X, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import StoryList from '../../components/StoryList';

const ProducerDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [mediaTypeFilter, setMediaTypeFilter] = useState<'all' | 'video' | 'audio' | 'pdf'>('all');
  const [genreFilter, setGenreFilter] = useState<string>('');
  const [directorIdFilter, setDirectorIdFilter] = useState<string>('');
  const [selectedDirectorName, setSelectedDirectorName] = useState<string>('');
  
  useEffect(() => {
    // If not authenticated or not a producer, redirect to login
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user?.role !== 'producer') {
      navigate('/director/dashboard');
    }
  }, [isAuthenticated, user, navigate]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The filtering is handled by the StoryList component
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setMediaTypeFilter('all');
    setGenreFilter('');
    setDirectorIdFilter('');
    setSelectedDirectorName('');
  };

  const handleDirectorClick = (directorId: string) => {
    setDirectorIdFilter(directorId);
    // Fetch director name from the stories list
    fetch('http://localhost:3000/api/stories')
      .then(response => response.json())
      .then(stories => {
        const story = stories.find((s: any) => s.directorId === directorId);
        if (story?.director?.name) {
          setSelectedDirectorName(story.director.name);
        }
      })
      .catch(error => console.error('Error fetching director name:', error));
  };
  
  if (!isAuthenticated || user?.role !== 'producer') {
    return null; // Or a loading spinner
  }
  
  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-dark-lighter p-6 rounded-lg shadow-sm mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Welcome, {user.name || user.email}</h1>
              <p className="text-gray-400">Discover talented directors and their stories</p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <button 
                onClick={() => navigate('/producer/profile')}
                className="flex items-center px-4 py-2 border border-primary/20 rounded-md text-gray-300 hover:bg-primary/10 transition-colors"
              >
                <UserCircle size={18} className="mr-2" />
                View Profile
              </button>
            </div>
          </div>
        </div>
        
        {/* Active Filters Display */}
        {(directorIdFilter || genreFilter || mediaTypeFilter !== 'all' || searchTerm) && (
          <div className="bg-dark-lighter p-4 rounded-lg shadow-sm mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-gray-400">Active Filters:</span>
              {directorIdFilter && (
                <div className="flex items-center gap-2 bg-primary/20 text-primary px-3 py-1 rounded-full">
                  <span>Director: {selectedDirectorName || directorIdFilter}</span>
                  <button
                    onClick={() => {
                      setDirectorIdFilter('');
                      setSelectedDirectorName('');
                    }}
                    className="hover:text-primary-light"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              {genreFilter && (
                <div className="flex items-center gap-2 bg-primary/20 text-primary px-3 py-1 rounded-full">
                  <span>Genre: {genreFilter}</span>
                  <button
                    onClick={() => setGenreFilter('')}
                    className="hover:text-primary-light"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              {mediaTypeFilter !== 'all' && (
                <div className="flex items-center gap-2 bg-primary/20 text-primary px-3 py-1 rounded-full">
                  <span>Type: {mediaTypeFilter}</span>
                  <button
                    onClick={() => setMediaTypeFilter('all')}
                    className="hover:text-primary-light"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              {searchTerm && (
                <div className="flex items-center gap-2 bg-primary/20 text-primary px-3 py-1 rounded-full">
                  <span>Search: {searchTerm}</span>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="hover:text-primary-light"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              <button
                onClick={handleResetFilters}
                className="text-gray-400 hover:text-white text-sm"
              >
                Clear All
              </button>
            </div>
          </div>
        )}
        
        {/* Search and Filter Section */}
        <div className="bg-dark-lighter p-6 rounded-lg shadow-sm mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search stories, directors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-primary/20 bg-dark text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter size={18} className="text-gray-400" />
                </div>
                <select
                  value={mediaTypeFilter}
                  onChange={(e) => setMediaTypeFilter(e.target.value as 'all' | 'video' | 'audio' | 'pdf')}
                  className="w-full pl-10 pr-4 py-2 border border-primary/20 bg-dark text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                >
                  <option value="all">All Media Types</option>
                  <option value="video">Video Only</option>
                  <option value="audio">Audio Only</option>
                  <option value="pdf">PDF Only</option>
                </select>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter size={18} className="text-gray-400" />
                </div>
                <select
                  value={genreFilter}
                  onChange={(e) => setGenreFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-primary/20 bg-dark text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                >
                  <option value="">All Genres</option>
                  <option value="Action">Action</option>
                  <option value="Drama">Drama</option>
                  <option value="Comedy">Comedy</option>
                  <option value="Thriller">Thriller</option>
                  <option value="Romance">Romance</option>
                  <option value="Horror">Horror</option>
                  <option value="Documentary">Documentary</option>
                </select>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Filter by Director ID"
                  value={directorIdFilter}
                  onChange={(e) => setDirectorIdFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-primary/20 bg-dark text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2 border border-primary/20 rounded-lg text-gray-300 hover:bg-primary/10 transition-colors"
              >
                Reset Filters
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </form>
        </div>
        
        {/* Stories Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">
              {directorIdFilter 
                ? `Stories by ${selectedDirectorName || `Director ${directorIdFilter}`}`
                : 'Discover Stories'}
            </h2>
          </div>
          
          <StoryList 
            searchTerm={searchTerm}
            mediaTypeFilter={mediaTypeFilter}
            genreFilter={genreFilter}
            directorIdFilter={directorIdFilter}
            onDirectorClick={handleDirectorClick}
          />
        </div>
        
        <div className="bg-primary/10 p-6 rounded-lg border border-primary/20">
          <h2 className="text-lg font-semibold text-white mb-3">Tips for Producers</h2>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Click on a Director ID to see all stories from that director.</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Use the search feature to find directors with specific skills or story themes.</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Contact directors directly through their provided contact information.</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Save stories you're interested in to revisit them later.</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default ProducerDashboard;