import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Users, Check } from 'lucide-react';
import Navbar from '../components/Navbar';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark text-white">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-dark-lighter to-dark">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Connect Directors with Producers
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
              A platform where creative storytellers showcase their work and connect with producers looking for the next big project.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div 
                onClick={() => navigate('/register?role=director')}
                className="bg-dark-lighter rounded-xl shadow-lg p-8 cursor-pointer transition-all duration-300 hover:shadow-primary/20 border-2 border-transparent hover:border-primary"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary/20 rounded-full">
                    <Film className="text-primary" size={32} />
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-white mb-3">I'm a Director</h2>
                <p className="text-gray-300 mb-6">
                  Showcase your creative work and find producers for your next project.
                </p>
                <button className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors">
                  Join as Director
                </button>
              </div>
              
              <div 
                onClick={() => navigate('/register?role=producer')}
                className="bg-dark-lighter rounded-xl shadow-lg p-8 cursor-pointer transition-all duration-300 hover:shadow-primary/20 border-2 border-transparent hover:border-primary"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary/20 rounded-full">
                    <Users className="text-primary" size={32} />
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-white mb-3">I'm a Producer</h2>
                <p className="text-gray-300 mb-6">
                  Discover talented directors and find compelling stories for your next production.
                </p>
                <button className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors">
                  Join as Producer
                </button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-dark-lighter">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              How It Works
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Create Your Profile</h3>
                <p className="text-gray-300">
                  Register as a director or producer and set up your professional profile.
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {`Share Your ${window.innerWidth < 768 ? 'Work' : 'Stories or Discover Talent'}`}
                </h3>
                <p className="text-gray-300">
                  Directors upload their creative works, while producers browse and discover talent.
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Connect & Collaborate</h3>
                <p className="text-gray-300">
                  Initiate conversations, discuss projects, and turn creative visions into reality.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Benefits Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-dark">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Why Choose Our Platform
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-dark-lighter p-6 rounded-lg shadow-lg">
                <h3 className="flex items-center text-xl font-semibold text-white mb-4">
                  <Check className="text-primary mr-2" size={24} />
                  For Directors
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <Check className="text-primary mt-1 mr-2 flex-shrink-0" size={16} />
                    <span>Showcase your portfolio to industry professionals</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-primary mt-1 mr-2 flex-shrink-0" size={16} />
                    <span>Get discovered by producers looking for your unique style</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-primary mt-1 mr-2 flex-shrink-0" size={16} />
                    <span>Manage your professional profile and contact information</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-primary mt-1 mr-2 flex-shrink-0" size={16} />
                    <span>Upload and organize your audio and video story concepts</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-dark-lighter p-6 rounded-lg shadow-lg">
                <h3 className="flex items-center text-xl font-semibold text-white mb-4">
                  <Check className="text-primary mr-2" size={24} />
                  For Producers
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <Check className="text-primary mt-1 mr-2 flex-shrink-0" size={16} />
                    <span>Discover talented directors with unique storytelling voices</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-primary mt-1 mr-2 flex-shrink-0" size={16} />
                    <span>Browse through a diverse collection of story concepts</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-primary mt-1 mr-2 flex-shrink-0" size={16} />
                    <span>Contact directors directly through the platform</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-primary mt-1 mr-2 flex-shrink-0" size={16} />
                    <span>Find your next project with our powerful search and filter tools</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Connect?</h2>
            <p className="text-primary-light text-lg mb-8">
              Join our growing community of creators and producers today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => navigate('/register')}
                className="px-8 py-3 bg-white text-primary font-medium rounded-md hover:bg-gray-100 transition-colors"
              >
                Register Now
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="px-8 py-3 bg-transparent border border-white text-white font-medium rounded-md hover:bg-primary-dark transition-colors"
              >
                Login
              </button>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-dark-lighter text-gray-400 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Director Story Showcase</h2>
            <p className="mb-8">Connecting creative talent with opportunities.</p>
            <div className="flex justify-center space-x-8 mb-8">
              <a href="#" className="hover:text-white transition-colors">About</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <p className="text-sm">&copy; 2024 Director Story Showcase. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;