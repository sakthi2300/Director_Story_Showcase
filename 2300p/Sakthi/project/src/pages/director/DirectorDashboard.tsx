import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, UserCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import StoryList from '../../components/StoryList';

const DirectorDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If not authenticated or not a director, redirect to login
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user?.role !== 'director') {
      navigate('/producer/dashboard');
    }
  }, [isAuthenticated, user, navigate]);
  
  if (!isAuthenticated || !user) {
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
              <p className="text-gray-400">Manage your profile and stories</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex space-x-4">
              <button 
                onClick={() => navigate('/director/profile')}
                className="flex items-center px-4 py-2 border border-primary/20 rounded-md text-gray-300 hover:bg-primary/10 transition-colors"
              >
                <UserCircle size={18} className="mr-2" />
                Edit Profile
              </button>
              
              <button 
                onClick={() => navigate('/director/add-story')}
                className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              >
                <Plus size={18} className="mr-2" />
                Add New Story
              </button>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Your Stories</h2>
          </div>
          
          <StoryList />
        </div>
        
        <div className="bg-primary/10 p-6 rounded-lg border border-primary/20">
          <h2 className="text-lg font-semibold text-white mb-3">Tips for Directors</h2>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Keep your stories concise and engaging to capture producers' interest.</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Use high-quality media that clearly demonstrates your visual style.</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Update your portfolio regularly with your latest work and ideas.</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Make sure your contact information is up-to-date so producers can reach you.</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default DirectorDashboard;