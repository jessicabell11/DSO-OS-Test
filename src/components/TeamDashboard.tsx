import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TeamDescriptionSection from './TeamDescriptionSection';
import TeamMembersSection from './TeamMembersSection';
import OutcomesSection from './OutcomesSection';
import ProgressSection from './ProgressSection';
import ReleaseNotesSection from './ReleaseNotesSection';
import BacklogSection from './BacklogSection';
import ProductAdoptionSection from './ProductAdoptionSection';
import RelatedTeamsSection from './RelatedTeamsSection';
import AIAssistant from './AIAssistant';
import Stepper from './Stepper';
import { Rocket, ArrowLeft, PlusCircle, Users } from 'lucide-react';
import { OutcomeData, ProgressData, BacklogItem, ReleaseNote, ProductAdoptionData, Recommendation, RelatedTeam, Team } from '../types';
import { outcomeData, progressData, backlogData, releaseNotesData, productAdoptionData } from '../data/dashboardData';
import { relatedTeamsData } from '../data/relatedTeamsData';
import { teamsData } from '../data/teamsData';
import { Link } from 'react-router-dom';

const TeamDashboard: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const [team, setTeam] = useState<Team | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [outcomes, setOutcomes] = useState<OutcomeData>(outcomeData);
  const [progress, setProgress] = useState<ProgressData>(progressData);
  const [releaseNotes, setReleaseNotes] = useState<ReleaseNote[]>(releaseNotesData);
  const [backlog, setBacklog] = useState<BacklogItem[]>(backlogData);
  const [productAdoption, setProductAdoption] = useState<ProductAdoptionData>(productAdoptionData);
  const [relatedTeams, setRelatedTeams] = useState<RelatedTeam[]>(relatedTeamsData);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isNewTeam, setIsNewTeam] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Create a ref to track if we're manually setting the active tab
  const manualTabChange = useRef(false);

  const teamWorkflowSteps = [
    'Long & Mid-Term Outcomes',
    'Team Setup & Working Agreement',
    '90-Day Cycle Plan',
    'Sprint Plan',
    'Daily Standup',
    'Sprint Review & Demo',
    '90-Day Cycle Retrospective'
  ];

  // Direct mapping between section IDs and sidebar tab IDs
  const sectionToTabMap: Record<string, string> = {
    'team-description-section': 'dashboard',
    'team-members-section': 'team',
    'outcomes-section': 'outcomes',
    'progress-section': 'progress',
    'product-adoption-section': 'adoption',
    'release-notes-section': 'accomplishments',
    'backlog-section': 'backlog',
    'related-teams-section': 'related-teams'
  };

  useEffect(() => {
    // Find the team data based on the teamId
    const foundTeam = teamsData.find(t => t.id === teamId);
    if (foundTeam) {
      setTeam(foundTeam);
      document.title = `${foundTeam.name} Dashboard`;
      
      // Check if this is a newly created team (no members and no business capabilities)
      if (
        (!foundTeam.members || foundTeam.members.length === 0) && 
        (!foundTeam.businessCapabilities || foundTeam.businessCapabilities.length === 0) &&
        !foundTeam.metrics
      ) {
        setIsNewTeam(true);
      } else {
        setIsNewTeam(false);
      }
    } else {
      // Redirect to teams explorer if team not found
      navigate('/teams');
    }
  }, [teamId, navigate]);

  // Function to manually set active tab when clicking on a section
  const setActiveTabManually = (tabId: string) => {
    manualTabChange.current = true;
    setActiveTab(tabId);
    
    // Reset the flag after a short delay
    setTimeout(() => {
      manualTabChange.current = false;
    }, 1000);
  };

  // Set up intersection observer to detect which section is currently visible
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.4, // Element is considered visible when 40% is in view
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // Skip if we're in the middle of a manual tab change
      if (manualTabChange.current) return;
      
      // Find the most visible section (highest intersection ratio)
      let maxRatio = 0;
      let mostVisibleSection = null;

      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          mostVisibleSection = entry.target.id;
        }
      });

      // Only update if we found a visible section
      if (mostVisibleSection) {
        setActiveSection(mostVisibleSection);
        
        // Update activeTab based on the section-to-tab mapping
        const tabId = sectionToTabMap[mostVisibleSection];
        if (tabId) {
          setActiveTab(tabId);
        }
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe all sections
    const sections = Object.keys(sectionToTabMap);
    
    sections.forEach(sectionId => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      sections.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, []);

  useEffect(() => {
    // Check if we need to scroll to a specific section
    if (location.state && location.state.scrollToSection) {
      const sectionId = location.state.scrollToSection;
      const section = document.getElementById(sectionId);
      if (section) {
        // Set the active tab manually before scrolling
        const tabId = sectionToTabMap[sectionId];
        if (tabId) {
          setActiveTabManually(tabId);
        }
        
        setTimeout(() => {
          section.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  const handleStepClick = (index: number) => {
    // Navigate to Long & Mid-Term Outcomes when clicking on step #1 (index 0)
    if (index === 0) {
      navigate(`/teams/${teamId}/long-mid-term-outcomes`);
    }
    // Navigate to Sprint Review & Demo when clicking on step #6 (index 5)
    else if (index === 5) {
      navigate(`/teams/${teamId}/sprint-review`);
    }
    // Add navigation for other steps as needed
    else if (index === 1) {
      navigate(`/teams/${teamId}/team-setup`);
    }
    else if (index === 2) {
      navigate(`/teams/${teamId}/90-day-cycle`);
    }
    else if (index === 3) {
      navigate(`/teams/${teamId}/sprint-plan`);
    }
    else if (index === 4) {
      navigate(`/teams/${teamId}/daily-standup`);
    }
    else if (index === 6) {
      navigate(`/teams/${teamId}/cycle-retrospective`);
    }
  };

  const addRecommendationToBacklog = (recommendation: Recommendation) => {
    // Generate a unique ID for the new backlog item
    const newId = `BL-${String(backlog.length + 1).padStart(3, '0')}`;
    
    // Map recommendation to backlog item format
    const newBacklogItem: BacklogItem = {
      id: newId,
      title: recommendation.title,
      description: recommendation.description,
      priority: recommendation.impact as 'high' | 'medium' | 'low',
      effort: recommendation.effort as 'small' | 'medium' | 'large',
      impact: recommendation.impact as 'high' | 'medium' | 'low',
      assignee: undefined, // No assignee by default
      dueDate: undefined, // No due date by default
      status: 'not-started',
      tags: ['Recommendation', recommendation.timeframe]
    };
    
    // Add the new item to the backlog
    setBacklog(prevBacklog => [...prevBacklog, newBacklogItem]);
    
    // Show notification
    setNotificationMessage(`"${recommendation.title}" added to backlog`);
    setShowNotification(true);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Function to handle direct navigation to a section
  const navigateToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      // Set the active tab manually before scrolling
      const tabId = sectionToTabMap[sectionId];
      if (tabId) {
        setActiveTabManually(tabId);
      }
      
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!team) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading team dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <Link to="/teams" className="text-blue-600 hover:text-blue-800 mr-3">
                  <ArrowLeft size={20} />
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  {team.logo ? (
                    <img 
                      src={team.logo} 
                      alt={`${team.name} logo`} 
                      className="h-8 w-8 rounded-full object-cover mr-2"
                    />
                  ) : (
                    <Rocket className="h-7 w-7 mr-2 text-blue-500" />
                  )}
                  {team.name}
                </h1>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {team.description}
              </p>
              
              {!isNewTeam && (
                <div className="mt-4 bg-white rounded-lg shadow p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Team Workflow</h3>
                  <Stepper 
                    steps={teamWorkflowSteps} 
                    currentStep={3} 
                    onStepClick={handleStepClick}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div id="team-description-section">
                <TeamDescriptionSection team={team} />
              </div>
              
              {isNewTeam ? (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Get Started with Your Team</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      Set up your team and start tracking your progress
                    </p>
                  </div>
                  <div className="px-4 py-12 sm:p-12 text-center">
                    <Users className="mx-auto h-12 w-12 text-blue-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Your team is ready!</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Start by adding team members, defining outcomes, or setting up your working agreement.
                    </p>
                    <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                      <Link
                        to={`/teams/${team.id}/team-setup`}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Set Up Team
                      </Link>
                      <Link
                        to="/teams"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Back to Teams Explorer
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div id="team-members-section">
                    <TeamMembersSection teamId={team.id} />
                  </div>
                  <div id="outcomes-section">
                    <OutcomesSection outcomes={outcomes} />
                  </div>
                  <div id="progress-section">
                    <ProgressSection progress={progress} />
                  </div>
                  <div id="product-adoption-section">
                    <ProductAdoptionSection 
                      productAdoption={productAdoption} 
                      addToBacklog={addRecommendationToBacklog} 
                    />
                  </div>
                  <div id="release-notes-section">
                    <ReleaseNotesSection releaseNotes={releaseNotes} />
                  </div>
                  <div id="backlog-section">
                    <BacklogSection backlog={backlog} setBacklog={setBacklog} />
                  </div>
                  <div id="related-teams-section">
                    <RelatedTeamsSection relatedTeams={relatedTeams} />
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
      <AIAssistant />
      
      {/* Notification */}
      {showNotification && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg z-50 flex items-center">
          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>{notificationMessage}</span>
        </div>
      )}
    </div>
  );
};

export default TeamDashboard;
