import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigateToProfile = () => {
    if (user?.role === 'director') {
      navigate('/director/profile');
    } else {
      navigate('/producer/profile');
    }
    setIsMenuOpen(false);
  };

  const navigateToDashboard = () => {
    if (user?.role === 'director') {
      navigate('/director/dashboard');
    } else {
      navigate('/producer/dashboard');
    }
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-dark-lighter/80 backdrop-blur-lg border-b border-primary/20 shadow-lg py-4 px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div 
          className="text-xl font-bold gradient-text cursor-pointer"
          onClick={() => navigate('/')}
        >
          Director Story Showcase
        </div>

        {isAuthenticated ? (
          <>
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={navigateToDashboard}
                className="nav-link"
              >
                Dashboard
              </button>
              <button 
                onClick={navigateToProfile}
                className="nav-link flex items-center"
              >
                <UserCircle className="mr-1" size={20} />
                Profile
              </button>
              <button 
                onClick={handleLogout}
                className="nav-link flex items-center"
              >
                <LogOut className="mr-1" size={20} />
                Logout
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button 
                onClick={toggleMenu}
                className="nav-link"
              >
                {isMenuOpen ? (
                  <X size={24} />
                ) : (
                  <Menu size={24} />
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="space-x-4">
            <button 
              onClick={() => navigate('/login')}
              className="nav-link px-4 py-2"
            >
              Login
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="button-primary"
            >
              Register
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && isAuthenticated && (
        <div className="md:hidden mt-4 glass-card rounded-md p-4 absolute right-4 left-4 z-50">
          <div className="flex flex-col space-y-3">
            <button 
              onClick={navigateToDashboard}
              className="nav-link py-2"
            >
              Dashboard
            </button>
            <button 
              onClick={navigateToProfile}
              className="nav-link flex items-center py-2"
            >
              <UserCircle className="mr-2" size={20} />
              Profile
            </button>
            <button 
              onClick={handleLogout}
              className="nav-link flex items-center py-2"
            >
              <LogOut className="mr-2" size={20} />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;