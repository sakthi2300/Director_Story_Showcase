import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import FormInput from '../../components/FormInput';
import { Film, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  const { login, isAuthenticated, user, error } = useAuth();
  const navigate = useNavigate();
  
  const [role, setRole] = useState<'director' | 'producer'>('director');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  useEffect(() => {
    // If already authenticated, redirect to the appropriate dashboard
    if (isAuthenticated && user) {
      if (user.role === 'director') {
        navigate('/director/dashboard');
      } else {
        navigate('/producer/dashboard');
      }
    }
  }, [isAuthenticated, user, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setLoginError('Please enter your email');
      return;
    }
    
    setLoading(true);
    setLoginError(null);
    
    try {
      const userData = await login(email, role, password);
      console.log('Login successful:', userData); // Add logging
      
      // After successful login, navigate based on role
      if (userData.role === 'director') {
        navigate('/director/dashboard');
      } else if (userData.role === 'producer') {
        navigate('/producer/dashboard');
      } else {
        setLoginError('Invalid user role');
      }
    } catch (err) {
      console.error('Login error:', err);
      setLoginError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // For demo purposes, pre-fill credentials
  const fillDemoCredentials = () => {
    if (role === 'director') {
      setEmail('demo@director.com');
    } else {
      setEmail('demo@producer.com');
    }
    setPassword('demo123');
  };
  
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Or{' '}
            <Link to="/register" className="font-medium text-primary hover:text-primary-light">
              create a new account
            </Link>
          </p>
        </div>

        {/* Role Selection */}
        <div className="flex space-x-4 justify-center">
          <button
            type="button"
            onClick={() => setRole('director')}
            className={`flex items-center px-4 py-2 rounded-md ${
              role === 'director'
                ? 'bg-primary text-white'
                : 'bg-dark-lighter text-gray-400 hover:text-white'
            }`}
          >
            <Film size={18} className="mr-2" />
            Director
          </button>
          <button
            type="button"
            onClick={() => setRole('producer')}
            className={`flex items-center px-4 py-2 rounded-md ${
              role === 'producer'
                ? 'bg-primary text-white'
                : 'bg-dark-lighter text-gray-400 hover:text-white'
            }`}
          >
            <Users size={18} className="mr-2" />
            Producer
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-primary/20 bg-dark-lighter text-white placeholder-gray-400 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-primary/20 bg-dark-lighter text-white placeholder-gray-400 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          {loginError && (
            <div className="text-red-400 text-sm text-center">
              {loginError}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-primary/20 rounded bg-dark-lighter"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                Remember me
              </label>
            </div>

            <button
              type="button"
              onClick={fillDemoCredentials}
              className="text-sm font-medium text-primary hover:text-primary-light"
            >
              Use Demo Account
            </button>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-dark"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>

        {/* Demo Account Suggestions */}
        <div className="mt-4 p-4 bg-dark-lighter rounded-md border border-primary/20">
          <h3 className="text-sm font-medium text-gray-300 mb-2">Demo Accounts:</h3>
          <div className="space-y-2 text-sm">
            <div className="text-gray-400">
              <p><span className="text-primary">Director:</span> demo@director.com / demo123</p>
            </div>
            <div className="text-gray-400">
              <p><span className="text-primary">Producer:</span> demo@producer.com / demo123</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;