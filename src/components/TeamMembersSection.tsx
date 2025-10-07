import React, { useState } from 'react';
import { Mail, Phone, MapPin, Linkedin, Github, Twitter, X, Calendar, Video } from 'lucide-react';
import { TeamMember } from '../types';
import { teamMembers } from '../data/teamData';

const TeamMembersSection: React.FC = () => {
  const [activeContact, setActiveContact] = useState<TeamMember | null>(null);
  const [contactCardPosition, setContactCardPosition] = useState({ top: 0, left: 0 });
  const [showContactCard, setShowContactCard] = useState(false);

  const handleMemberClick = (member: TeamMember, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    
    // Position the card near the clicked name but ensure it's visible
    const top = rect.bottom + scrollTop;
    const left = rect.left;
    
    setContactCardPosition({ top, left });
    setActiveContact(member);
    setShowContactCard(true);
  };

  const closeContactCard = () => {
    setShowContactCard(false);
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'bg-green-500';
      case 'busy':
        return 'bg-red-500';
      case 'away':
        return 'bg-yellow-500';
      case 'offline':
      default:
        return 'bg-gray-400';
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'Available';
      case 'busy':
        return 'Busy';
      case 'away':
        return 'Away';
      case 'offline':
      default:
        return 'Offline';
    }
  };

  return (
    <section id="team-members-section" className="bg-white rounded-lg shadow mb-6">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Team Members</h2>
        <p className="mt-1 text-sm text-gray-500">
          Meet the Accelerator team and connect with us
        </p>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {teamMembers.map((member) => (
            <div key={member.id} className="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition-colors">
              <div className="flex items-center">
                <div className="relative">
                  <img 
                    src={member.avatar} 
                    alt={member.name} 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <span 
                    className={`absolute bottom-0 right-0 w-3 h-3 ${getAvailabilityColor(member.availability)} border-2 border-white rounded-full`}
                    title={getAvailabilityText(member.availability)}
                  ></span>
                </div>
                <div className="ml-3">
                  <button 
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                    onClick={(e) => handleMemberClick(member, e)}
                  >
                    {member.name}
                  </button>
                  <p className="text-xs text-gray-500">{member.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Card (SharePoint-like) */}
      {showContactCard && activeContact && (
        <div 
          className="fixed z-50"
          style={{
            top: `${contactCardPosition.top}px`,
            left: `${contactCardPosition.left}px`,
          }}
        >
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-80">
            {/* Header with close button */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Contact Card</h3>
              <button 
                onClick={closeContactCard}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>
            
            {/* Profile section */}
            <div className="p-4 flex items-center border-b border-gray-200">
              <div className="relative">
                <img 
                  src={activeContact.avatar} 
                  alt={activeContact.name} 
                  className="w-16 h-16 rounded-full object-cover"
                />
                <span 
                  className={`absolute bottom-0 right-0 w-3 h-3 ${getAvailabilityColor(activeContact.availability)} border-2 border-white rounded-full`}
                ></span>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-medium text-gray-900">{activeContact.name}</h4>
                <p className="text-sm text-gray-600">{activeContact.role}</p>
                <p className="text-xs text-gray-500">{activeContact.department}</p>
                <div className="flex items-center mt-1">
                  <span className={`inline-block w-2 h-2 rounded-full ${getAvailabilityColor(activeContact.availability)} mr-1`}></span>
                  <span className="text-xs text-gray-500">{getAvailabilityText(activeContact.availability)}</span>
                </div>
              </div>
            </div>
            
            {/* Contact info */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center mb-2">
                <Mail size={16} className="text-gray-500 mr-2" />
                <a href={`mailto:${activeContact.email}`} className="text-sm text-blue-600 hover:underline">
                  {activeContact.email}
                </a>
              </div>
              {activeContact.phone && (
                <div className="flex items-center mb-2">
                  <Phone size={16} className="text-gray-500 mr-2" />
                  <a href={`tel:${activeContact.phone}`} className="text-sm text-blue-600 hover:underline">
                    {activeContact.phone}
                  </a>
                </div>
              )}
              {activeContact.location && (
                <div className="flex items-center">
                  <MapPin size={16} className="text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">{activeContact.location}</span>
                </div>
              )}
            </div>
            
            {/* Quick actions */}
            <div className="p-4 grid grid-cols-3 gap-2 border-b border-gray-200">
              <button className="flex flex-col items-center justify-center p-2 text-blue-600 hover:bg-blue-50 rounded">
                <Mail size={20} />
                <span className="text-xs mt-1">Email</span>
              </button>
              <button className="flex flex-col items-center justify-center p-2 text-blue-600 hover:bg-blue-50 rounded">
                <Calendar size={20} />
                <span className="text-xs mt-1">Schedule</span>
              </button>
              <button className="flex flex-col items-center justify-center p-2 text-blue-600 hover:bg-blue-50 rounded">
                <Video size={20} />
                <span className="text-xs mt-1">Call</span>
              </button>
            </div>
            
            {/* Skills */}
            <div className="p-4 border-b border-gray-200">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Skills</h5>
              <div className="flex flex-wrap gap-1">
                {activeContact.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Social links */}
            {activeContact.socialLinks && (
              <div className="p-4 flex space-x-4 justify-center">
                {activeContact.socialLinks.linkedin && (
                  <a 
                    href={activeContact.socialLinks.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    <Linkedin size={20} />
                  </a>
                )}
                {activeContact.socialLinks.github && (
                  <a 
                    href={activeContact.socialLinks.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <Github size={20} />
                  </a>
                )}
                {activeContact.socialLinks.twitter && (
                  <a 
                    href={activeContact.socialLinks.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-400"
                  >
                    <Twitter size={20} />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Overlay to close the contact card when clicking outside */}
      {showContactCard && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={closeContactCard}
        ></div>
      )}
    </section>
  );
};

export default TeamMembersSection;
