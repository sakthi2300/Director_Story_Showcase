import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserCircle, Mail, Phone, Users, Edit2, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

const ProducerProfile: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState('');
  const [editedPhone, setEditedPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // If not authenticated or not a producer, redirect to login
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user?.role !== 'producer') {
      navigate('/director/dashboard');
    }
  }, [isAuthenticated, user, navigate]);
  
  useEffect(() => {
    if (user) {
      setEditedBio(user.bio || '');
      setEditedPhone(user.phone || '');
    }
  }, [user]);
  
  const handleSaveProfile = async () => {
    try {
      setError(null);
      const response = await fetch('http://localhost:3000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: user?.id,
          name: user?.name,
          phone: editedPhone,
          bio: editedBio
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      // Update the user data in the auth context
      if (user) {
        const updatedUser = {
          ...user,
          phone: editedPhone,
          bio: editedBio
        };
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
        window.location.reload(); // Refresh to update the UI
      }

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error instanceof Error ? error.message : 'Failed to update profile');
    }
  };
  
  if (!isAuthenticated || !user) {
    return null; // Or a loading spinner
  }
  
  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/producer/dashboard')}
            className="flex items-center text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} className="mr-1" />
            Back to Dashboard
          </button>
          
          <button
            onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            {isEditing ? (
              <>
                <Save size={18} className="mr-2" />
                Save Changes
              </>
            ) : (
              <>
                <Edit2 size={18} className="mr-2" />
                Edit Profile
              </>
            )}
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-md text-red-500">
            {error}
          </div>
        )}
        
        <div className="bg-dark-lighter rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-primary/20">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-primary/20 rounded-full mr-4">
                <UserCircle size={32} className="text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                <p className="text-gray-400">Producer</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail size={18} className="text-gray-400 mr-3" />
                <a href={`mailto:${user.email}`} className="text-primary hover:text-primary-light">
                  {user.email}
                </a>
              </div>
              
              <div className="flex items-center">
                <Phone size={18} className="text-gray-400 mr-3" />
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedPhone}
                    onChange={(e) => setEditedPhone(e.target.value)}
                    className="border border-primary/20 bg-dark text-white rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <a href={`tel:${user.phone}`} className="text-primary hover:text-primary-light">
                    {user.phone || 'Add phone number'}
                  </a>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">About</h2>
            {isEditing ? (
              <textarea
                value={editedBio}
                onChange={(e) => setEditedBio(e.target.value)}
                className="w-full border border-primary/20 bg-dark text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary mb-6"
                rows={4}
                placeholder="Write something about yourself..."
              />
            ) : (
              <p className="text-gray-300 mb-6">{user.bio || 'No bio added yet.'}</p>
            )}
            
            <div className="flex items-center text-gray-400">
              <Users size={18} className="mr-2" />
              <span>Looking for Directors</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProducerProfile; 