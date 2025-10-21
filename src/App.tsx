import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TeamDescriptionSection from './components/TeamDescriptionSection';
import TeamMembersSection from './components/TeamMembersSection';
import OutcomesSection from './components/OutcomesSection';
import ProgressSection from './components/ProgressSection';
import ReleaseNotesSection from './components/ReleaseNotesSection';
import BacklogSection from './components/BacklogSection';
import ProductAdoptionSection from './components/ProductAdoptionSection';
import RelatedTeamsSection from './components/RelatedTeamsSection';
import TeamSetupPage from './components/TeamSetupPage';
import NinetyDayCyclePlan from './components/NinetyDayCyclePlan';
import SprintPlan from './components/SprintPlan';
import DailyStandup from './components/DailyStandup';
import SprintReviewDemo from './components/SprintReviewDemo';
import CycleRetrospective from './components/CycleRetrospective';
import TeamsExplorerPage from './components/TeamsExplorerPage';
import TeamDashboard from './components/TeamDashboard';
import LongMidTermOutcomes from './components/LongMidTermOutcomes';
import AIAssistant from './components/AIAssistant';
import Stepper from './components/Stepper';
import { Rocket } from 'lucide-react';
import { OutcomeData, ProgressData, BacklogItem, ReleaseNote, ProductAdoptionData, Recommendation, RelatedTeam } from './types';
import { outcomeData, progressData, backlogData, releaseNotesData, productAdoptionData } from './data/dashboardData';
import { relatedTeamsData } from './data/relatedTeamsData';

function Dashboard() {
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
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useState(new URLSearchParams(location.search));
  
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

  // Check if there's a team ID in the query string on component mount
  useEffect(() => {
    const teamId = searchParams.get('teamId');
    if (teamId) {
      // Navigate to the team dashboard
      navigate(`/teams/${teamId}`);
    }
  }, []);

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
    // Navigate to appropriate screen based on step index
    if (index === 0) {
      navigate('/long-mid-term-outcomes');
    } else if (index === 1) {
      navigate('/team-setup');
    } else if (index === 2) {
      navigate('/90-day-cycle');
    } else if (index === 3) {
      navigate('/sprint-plan');
    } else if (index === 4) {
      navigate('/daily-standup');
    } else if (index === 5) {
      navigate('/sprint-review');
    } else if (index === 6) {
      navigate('/cycle-retrospective');
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

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Rocket className="h-7 w-7 mr-2 text-blue-500" />
                Accelerator Team Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Tracking our progress toward "Health for all, Hunger for none"
              </p>
              <div className="mt-4 bg-white rounded-lg shadow p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Team Workflow</h3>
                <Stepper 
                  steps={teamWorkflowSteps} 
                  currentStep={3} 
                  onStepClick={handleStepClick}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div id="team-description-section">
                <TeamDescriptionSection />
              </div>
              <div id="team-members-section">
                <TeamMembersSection />
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
}

function AppWithRouter() {
  return (
    <Routes>
      {/* Change default route to redirect to Teams Explorer */}
      <Route path="/" element={<Navigate to="/teams" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/team-setup" element={<TeamSetupPage />} />
      <Route path="/long-mid-term-outcomes" element={<LongMidTermOutcomes />} />
      <Route path="/90-day-cycle" element={
        <NinetyDayCyclePlan 
          outcomes={outcomeData} 
          userResearch={productAdoptionData.userResearch}
          recommendations={productAdoptionData.recommendations}
          backlog={backlogData.map(item => {
            // Add cycle tags for demonstration purposes
            // In a real app, these would come from the database
            if (item.id === 'BL-001' || item.id === 'BL-003' || item.id === 'BL-005') {
              return {...item, tags: [...item.tags, 'Previous Cycle']};
            } else if (item.id === 'BL-002' || item.id === 'BL-004' || item.id === 'BL-006') {
              return {...item, tags: [...item.tags, 'Upcoming Cycle']};
            }
            return item;
          })}
        />
      } />
      <Route path="/sprint-plan" element={
        <SprintPlan 
          outcomes={outcomeData} 
          userResearch={productAdoptionData.userResearch}
          recommendations={productAdoptionData.recommendations}
          backlog={backlogData.map(item => {
            // Add sprint tags for demonstration purposes
            // In a real app, these would come from the database
            if (item.id === 'BL-001' || item.id === 'BL-003') {
              return {...item, tags: [...item.tags, 'Current Sprint']};
            } else if (item.id === 'BL-005') {
              return {...item, tags: [...item.tags, 'Completed Sprint'], status: 'completed'};
            }
            return item;
          })}
        />
      } />
      <Route path="/daily-standup" element={
        <DailyStandup 
          backlog={backlogData.map(item => {
            // Add sprint tags for demonstration purposes
            // In a real app, these would come from the database
            if (item.id === 'BL-001') {
              return {...item, tags: [...item.tags, 'Current Sprint'], status: 'in-progress'};
            } else if (item.id === 'BL-003') {
              return {...item, tags: [...item.tags, 'Current Sprint'], status: 'not-started'};
            } else if (item.id === 'BL-002') {
              return {...item, tags: [...item.tags, 'Current Sprint'], status: 'blocked'};
            } else if (item.id === 'BL-004') {
              return {...item, tags: [...item.tags, 'Current Sprint'], status: 'completed'};
            }
            return item;
          })}
        />
      } />
      <Route path="/sprint-review" element={
        <SprintReviewDemo 
          outcomes={outcomeData}
          backlog={backlogData.map(item => {
            // Add completed items for demonstration
            if (item.id === 'BL-004' || item.id === 'BL-005' || item.id === 'BL-006') {
              return {...item, tags: [...item.tags, 'Current Sprint'], status: 'completed'};
            }
            return item;
          })}
          releaseNotes={releaseNotesData}
        />
      } />
      <Route path="/cycle-retrospective" element={
        <CycleRetrospective 
          outcomes={outcomeData}
          backlog={backlogData}
        />
      } />
      
      {/* Teams Explorer Routes */}
      <Route path="/teams" element={<TeamsExplorerPage />} />
      <Route path="/teams/:teamId" element={<TeamDashboard />} />
      <Route path="/teams/:teamId/team-setup" element={<TeamSetupPage />} />
      <Route path="/teams/:teamId/long-mid-term-outcomes" element={<LongMidTermOutcomes />} />
      <Route path="/teams/:teamId/90-day-cycle" element={
        <NinetyDayCyclePlan 
          outcomes={outcomeData} 
          userResearch={productAdoptionData.userResearch}
          recommendations={productAdoptionData.recommendations}
          backlog={backlogData.map(item => {
            if (item.id === 'BL-001' || item.id === 'BL-003' || item.id === 'BL-005') {
              return {...item, tags: [...item.tags, 'Previous Cycle']};
            } else if (item.id === 'BL-002' || item.id === 'BL-004' || item.id === 'BL-006') {
              return {...item, tags: [...item.tags, 'Upcoming Cycle']};
            }
            return item;
          })}
        />
      } />
      <Route path="/teams/:teamId/sprint-plan" element={
        <SprintPlan 
          outcomes={outcomeData} 
          userResearch={productAdoptionData.userResearch}
          recommendations={productAdoptionData.recommendations}
          backlog={backlogData.map(item => {
            if (item.id === 'BL-001' || item.id === 'BL-003') {
              return {...item, tags: [...item.tags, 'Current Sprint']};
            } else if (item.id === 'BL-005') {
              return {...item, tags: [...item.tags, 'Completed Sprint'], status: 'completed'};
            }
            return item;
          })}
        />
      } />
      <Route path="/teams/:teamId/daily-standup" element={
        <DailyStandup 
          backlog={backlogData.map(item => {
            if (item.id === 'BL-001') {
              return {...item, tags: [...item.tags, 'Current Sprint'], status: 'in-progress'};
            } else if (item.id === 'BL-003') {
              return {...item, tags: [...item.tags, 'Current Sprint'], status: 'not-started'};
            } else if (item.id === 'BL-002') {
              return {...item, tags: [...item.tags, 'Current Sprint'], status: 'blocked'};
            } else if (item.id === 'BL-004') {
              return {...item, tags: [...item.tags, 'Current Sprint'], status: 'completed'};
            }
            return item;
          })}
        />
      } />
      <Route path="/teams/:teamId/sprint-review" element={
        <SprintReviewDemo 
          outcomes={outcomeData}
          backlog={backlogData.map(item => {
            if (item.id === 'BL-004' || item.id === 'BL-005' || item.id === 'BL-006') {
              return {...item, tags: [...item.tags, 'Current Sprint'], status: 'completed'};
            }
            return item;
          })}
          releaseNotes={releaseNotesData}
        />
      } />
      <Route path="/teams/:teamId/cycle-retrospective" element={
        <CycleRetrospective 
          outcomes={outcomeData}
          backlog={backlogData}
        />
      } />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppWithRouter />
    </Router>
  );
}

export default App;
