import React from 'react';
import { Story, Director } from '../types';
import { Film, Headphones, FileText, Calendar, Mail, Phone, Tag } from 'lucide-react';

interface StoryCardProps {
  story: Story;
  director?: Director;
  isProducer?: boolean;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, director, isProducer = false }) => {
  const [showContactInfo, setShowContactInfo] = React.useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const renderMediaPlayer = () => {
    switch (story.mediaType) {
      case 'video':
        return (
          <div className="aspect-video bg-dark-lighter rounded-lg flex items-center justify-center mb-4 border border-primary/20">
            <Film className="text-primary/60" size={48} />
            <span className="ml-2 text-primary/60">Video Preview</span>
          </div>
        );
      case 'audio':
        return (
          <div className="h-24 bg-dark-lighter rounded-lg flex items-center justify-center mb-4 border border-primary/20">
            <Headphones className="text-primary/60" size={32} />
            <span className="ml-2 text-primary/60">Audio Preview</span>
          </div>
        );
      case 'pdf':
        return (
          <div className="h-24 bg-dark-lighter rounded-lg flex items-center justify-center mb-4 border border-primary/20">
            <FileText className="text-primary/60" size={32} />
            <span className="ml-2 text-primary/60">PDF Document</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="card group">
      {renderMediaPlayer()}
      
      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary transition-colors">
        {story.title}
      </h3>
      
      <p className="text-gray-300 mb-4">{story.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {story.genres.map((genre) => (
          <span
            key={genre}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
          >
            <Tag size={12} className="mr-1" />
            {genre}
          </span>
        ))}
      </div>
      
      <div className="flex items-center text-gray-400 mb-4">
        <Calendar size={16} className="mr-1" />
        <span className="text-sm">{formatDate(story.createdAt)}</span>
      </div>
      
      {director && (
        <div className="border-t border-primary/20 pt-4 mt-2">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-white">Director: {director.name}</h4>
              <p className="text-sm text-gray-400 mt-1 line-clamp-2">{director.bio}</p>
            </div>
            
            {isProducer && (
              <button
                onClick={() => setShowContactInfo(!showContactInfo)}
                className="button-secondary"
              >
                {showContactInfo ? 'Hide Contact' : 'Show Contact'}
              </button>
            )}
          </div>
          
          {isProducer && showContactInfo && (
            <div className="mt-4 p-3 bg-dark-lighter rounded-lg border border-primary/20">
              <div className="flex items-center mb-2">
                <Mail size={16} className="text-primary/60 mr-2" />
                <a href={`mailto:${director.email}`} className="text-primary hover:text-primary-light transition-colors">
                  {director.email}
                </a>
              </div>
              <div className="flex items-center">
                <Phone size={16} className="text-primary/60 mr-2" />
                <a href={`tel:${director.phone}`} className="text-primary hover:text-primary-light transition-colors">
                  {director.phone}
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StoryCard;