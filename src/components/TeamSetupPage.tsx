import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  FileText, 
  Edit3, 
  Save, 
  X, 
  CheckCircle, 
  Clock, 
  Share2, 
  Download, 
  Upload, 
  AlertCircle,
  ArrowLeft,
  Eye,
  PlusCircle,
  Trash,
  Link,
  HelpCircle,
  Globe,
  FileSymlink,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Search,
  Image,
  Sparkles,
  MessageSquare,
  UserPlus,
  Percent,
  UserCheck,
  Layers,
  Building
} from 'lucide-react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { TeamWorkingAgreement, WorkingAgreementSection, TeamInfoLink, BusinessCapability, Team, TeamMember } from '../types';
import { defaultWorkingAgreement } from '../data/teamWorkingAgreementData';
import { coreCapabilities, enablingCapabilities, allBusinessCapabilities, getUniqueDomains } from '../data/businessCapabilitiesData';
import { teamsData } from '../data/teamsData';
import { teamMembers as allTeamMembers } from '../data/teamData';
import { platformsList, platformCategories, getPlatformCategory, getPlatformColor } from '../data/platformsData';
import { unitsByPlatform, getAllUnits } from '../data/unitsData';
import AIAssistant from './AIAssistant';
import Sidebar from './Sidebar';
import TeamMembersSection from './TeamMembersSection';

const TeamSetupPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const [team, setTeam] = useState<Team | null>(null);
  const [workingAgreement, setWorkingAgreement] = useState<TeamWorkingAgreement>({
    ...defaultWorkingAgreement,
    id: `wa-${Date.now()}`,
    title: 'Team Working Agreement',
    description: 'This document outlines how our team works together, our shared values, and our processes.',
    sections: [
      {
        id: 'section-1',
        title: 'Communication',
        content: 'Define your team communication channels and practices here.'
      },
      {
        id: 'section-2',
        title: 'Working Hours',
        content: 'Specify your team\'s working hours and availability expectations.'
      },
      {
        id: 'section-3',
        title: 'Development Practices',
        content: 'Document your team\'s development practices and standards.'
      }
    ],
    status: 'draft',
    version: 1.0,
    lastUpdated: new Date().toISOString(),
    approvals: [],
    teamInfoLinks: [],
    businessCapabilities: []
  });
  
  const [title, setTitle] = useState(workingAgreement.title);
  const [description, setDescription] = useState(workingAgreement.description);
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'approvals' | 'team-members'>('editor');
  const [sidebarActiveTab, setSidebarActiveTab] = useState('team-setup');
  const [isBacklogLinkEditing, setIsBacklogLinkEditing] = useState(false);
  const [backlogUrl, setBacklogUrl] = useState('');
  const [backlogType, setBacklogType] = useState('digital-product-journey');
  
  // Team info links state
  const [isAddingInfoLink, setIsAddingInfoLink] = useState(false);
  const [editingInfoLinkId, setEditingInfoLinkId] = useState<string | null>(null);
  const [infoLinkTitle, setInfoLinkTitle] = useState('');
  const [infoLinkUrl, setInfoLinkUrl] = useState('');
  const [infoLinkType, setInfoLinkType] = useState<'sharepoint' | 'wiki' | 'documentation' | 'teams-channel' | 'other'>('sharepoint');
  const [infoLinkDescription, setInfoLinkDescription] = useState('');
  const [infoLinkErrors, setInfoLinkErrors] = useState<{
    title?: string;
    url?: string;
  }>({});
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Business capabilities state
  const [isCapabilitiesExpanded, setIsCapabilitiesExpanded] = useState(false);
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCapabilityCategory, setActiveCapabilityCategory] = useState<'core' | 'enabling'>('core');

  // Team logo state
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [isGeneratingLogo, setIsGeneratingLogo] = useState(false);
  const [logoPrompt, setLogoPrompt] = useState('');
  const [logoPromptError, setLogoPromptError] = useState<string | null>(null);
  const [generatedLogos, setGeneratedLogos] = useState<string[]>([]);
  const [selectedGeneratedLogo, setSelectedGeneratedLogo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Team members state
  const [teamMembers, setTeamMembers] = useState<Array<TeamMember & { role?: string; allocation?: number }>>([]);
  const [isAddingTeamMember, setIsAddingTeamMember] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [memberRole, setMemberRole] = useState<string>('');
  const [memberAllocation, setMemberAllocation] = useState<number>(100);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [memberSearchQuery, setMemberSearchQuery] = useState<string>('');
  const [memberErrors, setMemberErrors] = useState<{
    member?: string;
    role?: string;
    allocation?: string;
  }>({});

  // Platform and Unit state
  const [isPlatformEditing, setIsPlatformEditing] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [selectedUnit, setSelectedUnit] = useState<string>('');
  const [platformSearchQuery, setPlatformSearchQuery] = useState<string>('');
  const [unitSearchQuery, setUnitSearchQuery] = useState<string>('');
  const [availableUnits, setAvailableUnits] = useState<string[]>([]);

  // Confirmation dialog state
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmDialogTitle, setConfirmDialogTitle] = useState('');
  const [confirmDialogMessage, setConfirmDialogMessage] = useState('');
  const [confirmDialogAction, setConfirmDialogAction] = useState<() => void>(() => {});

  const DPJ_DOCUMENTATION_URL = "https://bayergroup.sharepoint.com/sites/026557/SitePages/Technology%20%26%20Engineering/Engineering%20Enablement%20site/openproject_techdoc.aspx?siteid={5CD3A45F-1F48-4F51-A74C-D96928B44568}&webid={E522E984-78F4-4F8F-887D-9244724C8A62}&uniqueid={86603172-74D0-43DA-92FE-6488ADE20191}";

  // Load team data when component mounts or teamId changes
  useEffect(() => {
    if (teamId) {
      const foundTeam = teamsData.find(t => t.id === teamId);
      if (foundTeam) {
        setTeam(foundTeam);
        
        // If the team has a logo, set it
        if (foundTeam.logo) {
          setLogoUrl(foundTeam.logo);
        }
        
        // If the team has existing working agreement data, use it
        // Otherwise, keep the default empty working agreement
        if (foundTeam.workingAgreementId) {
          // In a real app, we would fetch the working agreement by ID
          // For now, we'll use the default one but update the title
          setWorkingAgreement(prev => ({
            ...prev,
            title: `${foundTeam.name} Working Agreement`,
            description: `Working agreement for the ${foundTeam.name} team.`
          }));
          setTitle(`${foundTeam.name} Working Agreement`);
          setDescription(`Working agreement for the ${foundTeam.name} team.`);
        } else {
          // For a new team without a working agreement, set a default title with the team name
          setWorkingAgreement(prev => ({
            ...prev,
            title: `${foundTeam.name} Working Agreement`,
            description: `Working agreement for the ${foundTeam.name} team.`
          }));
          setTitle(`${foundTeam.name} Working Agreement`);
          setDescription(`Working agreement for the ${foundTeam.name} team.`);
        }
        
        // If the team has business capabilities, use them
        if (foundTeam.businessCapabilities && foundTeam.businessCapabilities.length > 0) {
          setSelectedCapabilities(foundTeam.businessCapabilities);
        } else {
          setSelectedCapabilities([]);
        }
        
        // If the team has a backlog link, use it
        if (foundTeam.backlogLink) {
          setBacklogUrl(foundTeam.backlogLink.url || '');
          setBacklogType(foundTeam.backlogLink.type || 'digital-product-journey');
        } else {
          setBacklogUrl('');
          setBacklogType('digital-product-journey');
        }

        // Load team members if they exist
        if (foundTeam.members && foundTeam.members.length > 0) {
          // Find the full member details from allTeamMembers
          const membersWithDetails = foundTeam.members.map(memberId => {
            const memberDetails = allTeamMembers.find(m => m.id === memberId);
            if (memberDetails) {
              return {
                ...memberDetails,
                role: foundTeam.memberRoles?.[memberId] || '',
                allocation: foundTeam.memberAllocations?.[memberId] || 100
              };
            }
            return null;
          }).filter(Boolean) as Array<TeamMember & { role?: string; allocation?: number }>;
          
          setTeamMembers(membersWithDetails);
        } else {
          setTeamMembers([]);
        }

        // Set platform and unit if they exist
        if (foundTeam.platform) {
          setSelectedPlatform(foundTeam.platform);
          
          // Update available units based on selected platform
          if (unitsByPlatform[foundTeam.platform]) {
            setAvailableUnits(unitsByPlatform[foundTeam.platform]);
          } else {
            setAvailableUnits([]);
          }
          
          // Set unit if it exists
          if (foundTeam.unit) {
            setSelectedUnit(foundTeam.unit);
          } else {
            setSelectedUnit('');
          }
        } else {
          setSelectedPlatform('');
          setSelectedUnit('');
          setAvailableUnits([]);
        }
      }
    }
  }, [teamId]);

  const handleSectionEdit = (sectionId: string) => {
    setWorkingAgreement(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === sectionId ? { ...section, isEditing: true } : section
      )
    }));
  };

  const handleSectionSave = (sectionId: string, newContent: string) => {
    setWorkingAgreement(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === sectionId ? { ...section, content: newContent, isEditing: false } : section
      ),
      lastUpdated: new Date().toISOString()
    }));
    
    showSuccess('Section updated successfully');
  };

  const handleSectionCancel = (sectionId: string) => {
    setWorkingAgreement(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === sectionId ? { ...section, isEditing: false } : section
      )
    }));
  };

  const handleTitleSave = () => {
    setWorkingAgreement(prev => ({
      ...prev,
      title,
      lastUpdated: new Date().toISOString()
    }));
    setIsTitleEditing(false);
    showSuccess('Title updated successfully');
  };

  const handleDescriptionSave = () => {
    setWorkingAgreement(prev => ({
      ...prev,
      description,
      lastUpdated: new Date().toISOString()
    }));
    setIsDescriptionEditing(false);
    showSuccess('Description updated successfully');
  };

  const handleBacklogLinkSave = () => {
    setWorkingAgreement(prev => ({
      ...prev,
      backlogLink: {
        url: backlogUrl,
        type: backlogType as 'digital-product-journey' | 'azure-devops' | 'aha' | 'other'
      },
      lastUpdated: new Date().toISOString()
    }));
    
    // Also update the team data
    if (team) {
      const updatedTeam = {
        ...team,
        backlogLink: {
          url: backlogUrl,
          type: backlogType as 'digital-product-journey' | 'azure-devops' | 'aha' | 'other'
        }
      };
      
      // Update the team in teamsData array
      const teamIndex = teamsData.findIndex(t => t.id === team.id);
      if (teamIndex !== -1) {
        teamsData[teamIndex] = updatedTeam;
      }
      
      setTeam(updatedTeam);
    }
    
    setIsBacklogLinkEditing(false);
    showSuccess('Backlog link updated successfully');
  };

  const handleAddSection = () => {
    const newSection: WorkingAgreementSection = {
      id: `section-${workingAgreement.sections.length + 1}`,
      title: 'New Section',
      content: 'Add content here...',
      isEditing: true
    };
    
    setWorkingAgreement(prev => ({
      ...prev,
      sections: [...prev.sections, newSection],
      lastUpdated: new Date().toISOString()
    }));
  };

  const handleSectionTitleChange = (sectionId: string, newTitle: string) => {
    setWorkingAgreement(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === sectionId ? { ...section, title: newTitle } : section
      ),
      lastUpdated: new Date().toISOString()
    }));
  };

  const handleDeleteSection = (sectionId: string) => {
    // Find the section to get its title
    const sectionToDelete = workingAgreement.sections.find(section => section.id === sectionId);
    
    if (sectionToDelete) {
      showConfirmationDialog(
        'Delete Section',
        `Are you sure you want to delete the "${sectionToDelete.title}" section? This action cannot be undone.`,
        () => {
          setWorkingAgreement(prev => ({
            ...prev,
            sections: prev.sections.filter(section => section.id !== sectionId),
            lastUpdated: new Date().toISOString()
          }));
          showSuccess('Section deleted successfully');
        }
      );
    }
  };

  const handleApprove = (memberId: string) => {
    setWorkingAgreement(prev => ({
      ...prev,
      approvals: prev.approvals.map(approval => 
        approval.memberId === memberId 
          ? { ...approval, approved: true, approvedAt: new Date().toISOString() } 
          : approval
      ),
      lastUpdated: new Date().toISOString()
    }));
    showSuccess('Working agreement approved');
  };

  const handlePublish = () => {
    setWorkingAgreement(prev => ({
      ...prev,
      status: 'active',
      version: Math.round((prev.version + 0.1) * 10) / 10,
      lastUpdated: new Date().toISOString()
    }));
    
    // Update the team with the working agreement ID
    if (team) {
      const updatedTeam = {
        ...team,
        workingAgreementId: workingAgreement.id
      };
      
      // Update the team in teamsData array
      const teamIndex = teamsData.findIndex(t => t.id === team.id);
      if (teamIndex !== -1) {
        teamsData[teamIndex] = updatedTeam;
      }
      
      setTeam(updatedTeam);
    }
    
    showSuccess('Working agreement published successfully');
  };

  // Team info links handlers
  const handleAddInfoLink = () => {
    setIsAddingInfoLink(true);
    setInfoLinkTitle('');
    setInfoLinkUrl('');
    setInfoLinkType('sharepoint');
    setInfoLinkDescription('');
    setInfoLinkErrors({});
  };

  const handleEditInfoLink = (link: TeamInfoLink) => {
    setEditingInfoLinkId(link.id);
    setInfoLinkTitle(link.title);
    setInfoLinkUrl(link.url);
    setInfoLinkType(link.type);
    setInfoLinkDescription(link.description || '');
    setInfoLinkErrors({});
  };

  const validateInfoLink = (): boolean => {
    const errors: {
      title?: string;
      url?: string;
    } = {};
    
    if (!infoLinkTitle.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!infoLinkUrl.trim()) {
      errors.url = 'URL is required';
    } else if (!isValidUrl(infoLinkUrl)) {
      errors.url = 'Please enter a valid URL (e.g., https://example.com)';
    }
    
    setInfoLinkErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      const errorMessages = Object.values(errors).join(', ');
      showError(`Please fix the following: ${errorMessages}`);
      return false;
    }
    
    return true;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSaveInfoLink = () => {
    if (!validateInfoLink()) {
      return;
    }

    if (isAddingInfoLink) {
      const newLink: TeamInfoLink = {
        id: `link-${Date.now()}`,
        title: infoLinkTitle,
        url: infoLinkUrl,
        type: infoLinkType,
        description: infoLinkDescription || undefined
      };

      setWorkingAgreement(prev => ({
        ...prev,
        teamInfoLinks: [...(prev.teamInfoLinks || []), newLink],
        lastUpdated: new Date().toISOString()
      }));
      
      // Also update the team data
      if (team) {
        const updatedTeam = {
          ...team,
          teamInfoLinks: [...(team.teamInfoLinks || []), newLink]
        };
        
        // Update the team in teamsData array
        const teamIndex = teamsData.findIndex(t => t.id === team.id);
        if (teamIndex !== -1) {
          teamsData[teamIndex] = updatedTeam;
        }
        
        setTeam(updatedTeam);
      }
      
      setIsAddingInfoLink(false);
      showSuccess('Team information link added successfully');
    } else if (editingInfoLinkId) {
      const updatedLink = {
        id: editingInfoLinkId,
        title: infoLinkTitle,
        url: infoLinkUrl,
        type: infoLinkType,
        description: infoLinkDescription || undefined
      };
      
      setWorkingAgreement(prev => ({
        ...prev,
        teamInfoLinks: (prev.teamInfoLinks || []).map(link => 
          link.id === editingInfoLinkId ? updatedLink : link
        ),
        lastUpdated: new Date().toISOString()
      }));
      
      // Also update the team data
      if (team && team.teamInfoLinks) {
        const updatedTeam = {
          ...team,
          teamInfoLinks: team.teamInfoLinks.map(link => 
            link.id === editingInfoLinkId ? updatedLink : link
          )
        };
        
        // Update the team in teamsData array
        const teamIndex = teamsData.findIndex(t => t.id === team.id);
        if (teamIndex !== -1) {
          teamsData[teamIndex] = updatedTeam;
        }
        
        setTeam(updatedTeam);
      }
      
      setEditingInfoLinkId(null);
      showSuccess('Team information link updated successfully');
    }
  };

  const handleCancelInfoLink = () => {
    setIsAddingInfoLink(false);
    setEditingInfoLinkId(null);
    setInfoLinkErrors({});
  };

  const handleDeleteInfoLink = (linkId: string) => {
    // Find the link to get its title
    const linkToDelete = workingAgreement.teamInfoLinks?.find(link => link.id === linkId);
    
    if (linkToDelete) {
      showConfirmationDialog(
        'Delete Team Information Link',
        `Are you sure you want to delete the "${linkToDelete.title}" link? This action cannot be undone.`,
        () => {
          setWorkingAgreement(prev => ({
            ...prev,
            teamInfoLinks: (prev.teamInfoLinks || []).filter(link => link.id !== linkId),
            lastUpdated: new Date().toISOString()
          }));
          
          // Also update the team data
          if (team && team.teamInfoLinks) {
            const updatedTeam = {
              ...team,
              teamInfoLinks: team.teamInfoLinks.filter(link => link.id !== linkId)
            };
            
            // Update the team in teamsData array
            const teamIndex = teamsData.findIndex(t => t.id === team.id);
            if (teamIndex !== -1) {
              teamsData[teamIndex] = updatedTeam;
            }
            
            setTeam(updatedTeam);
          }
          
          showSuccess('Team information link deleted successfully');
        }
      );
    }
  };

  // Business capabilities handlers
  const handleCapabilityToggle = (capabilityId: string) => {
    setSelectedCapabilities(prev => {
      const isSelected = prev.includes(capabilityId);
      const newSelected = isSelected
        ? prev.filter(id => id !== capabilityId)
        : [...prev, capabilityId];
      
      // Update working agreement with new selected capabilities
      setWorkingAgreement(prevAgreement => ({
        ...prevAgreement,
        businessCapabilities: newSelected,
        lastUpdated: new Date().toISOString()
      }));
      
      // Also update the team data
      if (team) {
        const updatedTeam = {
          ...team,
          businessCapabilities: newSelected
        };
        
        // Update the team in teamsData array
        const teamIndex = teamsData.findIndex(t => t.id === team.id);
        if (teamIndex !== -1) {
          teamsData[teamIndex] = updatedTeam;
        }
        
        setTeam(updatedTeam);
      }
      
      return newSelected;
    });
  };

  // Team logo handlers
  const handleLogoModalOpen = () => {
    setIsLogoModalOpen(true);
    setLogoPromptError(null);
  };

  const handleLogoModalClose = () => {
    setIsLogoModalOpen(false);
    setSelectedGeneratedLogo(null);
    setGeneratedLogos([]);
    setLogoPrompt('');
    setLogoPromptError(null);
  };

  const handleLogoUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setLogoUrl(result);
        updateTeamLogo(result);
        // Automatically close the modal after file upload
        handleLogoModalClose();
      };
      reader.readAsDataURL(file);
    }
  };

  const validateLogoPrompt = (): boolean => {
    if (!logoPrompt.trim()) {
      setLogoPromptError('Please enter a description for the logo');
      return false;
    }
    
    setLogoPromptError(null);
    return true;
  };

  const handleGenerateLogo = () => {
    if (!validateLogoPrompt()) {
      return;
    }

    setIsGeneratingLogo(true);

    // Simulate AI logo generation with a delay
    setTimeout(() => {
      // Generate some placeholder logos (in a real app, these would come from an AI service)
      const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
      const mockLogos = colors.map((color, index) => {
        // Create a simple SVG logo with the first letter of the team name
        const letter = team?.name.charAt(0) || 'T';
        return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="${color}" /><text x="50" y="65" font-family="Arial" font-size="45" font-weight="bold" text-anchor="middle" fill="white">${letter}</text></svg>`;
      });

      setGeneratedLogos(mockLogos);
      setIsGeneratingLogo(false);
    }, 2000);
  };

  const handleSelectGeneratedLogo = (logo: string) => {
    setSelectedGeneratedLogo(logo);
  };

  const handleApplyGeneratedLogo = () => {
    if (selectedGeneratedLogo) {
      setLogoUrl(selectedGeneratedLogo);
      updateTeamLogo(selectedGeneratedLogo);
      handleLogoModalClose();
    }
  };

  const updateTeamLogo = (logoUrl: string) => {
    if (team) {
      const updatedTeam = {
        ...team,
        logo: logoUrl
      };
      
      // Update the team in teamsData array
      const teamIndex = teamsData.findIndex(t => t.id === team.id);
      if (teamIndex !== -1) {
        teamsData[teamIndex] = updatedTeam;
      }
      
      setTeam(updatedTeam);
      showSuccess('Team logo updated successfully');
    }
  };

  // Team members handlers
  const handleAddTeamMember = () => {
    setIsAddingTeamMember(true);
    setSelectedMemberId('');
    setMemberRole('');
    setMemberAllocation(100);
    setMemberErrors({});
  };

  const handleEditTeamMember = (memberId: string) => {
    const member = teamMembers.find(m => m.id === memberId);
    if (member) {
      setEditingMemberId(memberId);
      setSelectedMemberId(memberId);
      setMemberRole(member.role || '');
      setMemberAllocation(member.allocation || 100);
      setMemberErrors({});
    }
  };

  const validateTeamMember = (): boolean => {
    const errors: {
      member?: string;
      role?: string;
      allocation?: string;
    } = {};
    
    if (!selectedMemberId) {
      errors.member = 'Please select a team member';
    }
    
    if (!memberRole.trim()) {
      errors.role = 'Role is required';
    }
    
    if (memberAllocation < 1 || memberAllocation > 100) {
      errors.allocation = 'Allocation must be between 1% and 100%';
    }
    
    setMemberErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      const errorMessages = Object.values(errors).join(', ');
      showError(`Please fix the following: ${errorMessages}`);
      return false;
    }
    
    return true;
  };

  const handleSaveTeamMember = () => {
    if (!validateTeamMember()) {
      return;
    }

    // Find the member details from allTeamMembers
    const memberDetails = allTeamMembers.find(m => m.id === selectedMemberId);
    if (!memberDetails) {
      showError('Selected team member not found');
      return;
    }

    if (editingMemberId) {
      // Update existing member
      const updatedMembers = teamMembers.map(m => 
        m.id === editingMemberId 
          ? { ...m, role: memberRole, allocation: memberAllocation }
          : m
      );
      
      setTeamMembers(updatedMembers);
      
      // Update the team data
      if (team) {
        const memberIds = updatedMembers.map(m => m.id);
        const memberRoles = updatedMembers.reduce((acc, m) => {
          if (m.role) acc[m.id] = m.role;
          return acc;
        }, {} as Record<string, string>);
        
        const memberAllocations = updatedMembers.reduce((acc, m) => {
          if (m.allocation) acc[m.id] = m.allocation;
          return acc;
        }, {} as Record<string, number>);
        
        const updatedTeam = {
          ...team,
          members: memberIds,
          memberRoles,
          memberAllocations
        };
        
        // Update the team in teamsData array
        const teamIndex = teamsData.findIndex(t => t.id === team.id);
        if (teamIndex !== -1) {
          teamsData[teamIndex] = updatedTeam;
        }
        
        setTeam(updatedTeam);
      }
      
      setEditingMemberId(null);
      showSuccess('Team member updated successfully');
    } else {
      // Check if member already exists in the team
      if (teamMembers.some(m => m.id === selectedMemberId)) {
        showError('This person is already a member of the team');
        return;
      }
      
      // Add new member
      const newMember = {
        ...memberDetails,
        role: memberRole,
        allocation: memberAllocation
      };
      
      const updatedMembers = [...teamMembers, newMember];
      setTeamMembers(updatedMembers);
      
      // Update the team data
      if (team) {
        const memberIds = updatedMembers.map(m => m.id);
        const memberRoles = updatedMembers.reduce((acc, m) => {
          if (m.role) acc[m.id] = m.role;
          return acc;
        }, {} as Record<string, string>);
        
        const memberAllocations = updatedMembers.reduce((acc, m) => {
          if (m.allocation) acc[m.id] = m.allocation;
          return acc;
        }, {} as Record<string, number>);
        
        const updatedTeam = {
          ...team,
          members: memberIds,
          memberRoles,
          memberAllocations
        };
        
        // Update the team in teamsData array
        const teamIndex = teamsData.findIndex(t => t.id === team.id);
        if (teamIndex !== -1) {
          teamsData[teamIndex] = updatedTeam;
        }
        
        setTeam(updatedTeam);
      }
      
      setIsAddingTeamMember(false);
      showSuccess('Team member added successfully');
    }
  };

  const handleCancelTeamMember = () => {
    setIsAddingTeamMember(false);
    setEditingMemberId(null);
    setMemberErrors({});
  };

  const handleDeleteTeamMember = (memberId: string) => {
    const memberToDelete = teamMembers.find(m => m.id === memberId);
    
    if (memberToDelete) {
      showConfirmationDialog(
        'Remove Team Member',
        `Are you sure you want to remove ${memberToDelete.name} from the team? This action cannot be undone.`,
        () => {
          const updatedMembers = teamMembers.filter(m => m.id !== memberId);
          setTeamMembers(updatedMembers);
          
          // Update the team data
          if (team) {
            const memberIds = updatedMembers.map(m => m.id);
            const memberRoles = updatedMembers.reduce((acc, m) => {
              if (m.role) acc[m.id] = m.role;
              return acc;
            }, {} as Record<string, string>);
            
            const memberAllocations = updatedMembers.reduce((acc, m) => {
              if (m.allocation) acc[m.id] = m.allocation;
              return acc;
            }, {} as Record<string, number>);
            
            const updatedTeam = {
              ...team,
              members: memberIds,
              memberRoles,
              memberAllocations
            };
            
            // Update the team in teamsData array
            const teamIndex = teamsData.findIndex(t => t.id === team.id);
            if (teamIndex !== -1) {
              teamsData[teamIndex] = updatedTeam;
            }
            
            setTeam(updatedTeam);
          }
          
          showSuccess('Team member removed successfully');
        }
      );
    }
  };

  // Platform and Unit handlers
  const handleEditPlatform = () => {
    setIsPlatformEditing(true);
    setPlatformSearchQuery('');
    setUnitSearchQuery('');
  };

  const handlePlatformSelect = (platform: string) => {
    setSelectedPlatform(platform);
    
    // Update available units based on selected platform
    if (unitsByPlatform[platform]) {
      setAvailableUnits(unitsByPlatform[platform]);
      setSelectedUnit(''); // Reset unit when platform changes
    } else {
      setAvailableUnits([]);
      setSelectedUnit('');
    }
  };

  const handleUnitSelect = (unit: string) => {
    setSelectedUnit(unit);
  };

  const handleSavePlatformUnit = () => {
    if (team) {
      const updatedTeam = {
        ...team,
        platform: selectedPlatform,
        unit: selectedUnit || undefined
      };
      
      // Update the team in teamsData array
      const teamIndex = teamsData.findIndex(t => t.id === team.id);
      if (teamIndex !== -1) {
        teamsData[teamIndex] = updatedTeam;
      }
      
      setTeam(updatedTeam);
      setIsPlatformEditing(false);
      showSuccess('Team platform and unit updated successfully');
    }
  };

  const handleCancelPlatformEdit = () => {
    // Reset to current team values
    if (team) {
      setSelectedPlatform(team.platform || '');
      
      if (team.platform && unitsByPlatform[team.platform]) {
        setAvailableUnits(unitsByPlatform[team.platform]);
      } else {
        setAvailableUnits([]);
      }
      
      setSelectedUnit(team.unit || '');
    } else {
      setSelectedPlatform('');
      setSelectedUnit('');
      setAvailableUnits([]);
    }
    
    setIsPlatformEditing(false);
  };

  const getFilteredPlatforms = () => {
    if (!platformSearchQuery) {
      return platformsList;
    }
    
    const query = platformSearchQuery.toLowerCase();
    return platformsList.filter(platform => 
      platform.toLowerCase().includes(query) || 
      getPlatformCategory(platform).toLowerCase().includes(query)
    );
  };

  const getFilteredUnits = () => {
    if (!unitSearchQuery) {
      return availableUnits;
    }
    
    const query = unitSearchQuery.toLowerCase();
    return availableUnits.filter(unit => 
      unit.toLowerCase().includes(query)
    );
  };

  const filteredCapabilities = (category: 'core' | 'enabling') => {
    const capabilities = category === 'core' ? coreCapabilities : enablingCapabilities;
    
    if (!searchQuery) {
      return capabilities;
    }
    
    const query = searchQuery.toLowerCase();
    return capabilities.filter(
      cap => cap.name.toLowerCase().includes(query) || 
             cap.domain.toLowerCase().includes(query) ||
             (cap.description && cap.description.toLowerCase().includes(query))
    );
  };

  const getSelectedCapabilitiesCount = () => {
    return selectedCapabilities.length;
  };

  const getCapabilityById = (id: string) => {
    return allBusinessCapabilities.find(cap => cap.id === id);
  };

  const getCapabilitiesByDomain = (capabilities: BusinessCapability[]) => {
    const domains = getUniqueDomains(activeCapabilityCategory);
    const result: Record<string, BusinessCapability[]> = {};
    
    domains.forEach(domain => {
      result[domain] = capabilities.filter(cap => cap.domain === domain);
    });
    
    return result;
  };

  // Filter available team members based on search query
  const getFilteredAvailableMembers = () => {
    const currentMemberIds = teamMembers.map(m => m.id);
    const availableMembers = allTeamMembers.filter(m => !currentMemberIds.includes(m.id) || m.id === selectedMemberId);
    
    if (!memberSearchQuery) {
      return availableMembers;
    }
    
    const query = memberSearchQuery.toLowerCase();
    return availableMembers.filter(
      member => member.name.toLowerCase().includes(query) || 
                member.role.toLowerCase().includes(query) ||
                (member.department && member.department.toLowerCase().includes(query))
    );
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessMessage(true);
    setShowErrorMessage(false);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const showError = (message: string) => {
    setErrorMessage(message);
    setShowErrorMessage(true);
    setShowSuccessMessage(false);
    setTimeout(() => {
      setShowErrorMessage(false);
    }, 5000);
  };

  // Confirmation dialog handler
  const showConfirmationDialog = (title: string, message: string, onConfirm: () => void) => {
    setConfirmDialogTitle(title);
    setConfirmDialogMessage(message);
    setConfirmDialogAction(() => onConfirm);
    setShowConfirmDialog(true);
  };

  const handleConfirmDialogConfirm = () => {
    confirmDialogAction();
    setShowConfirmDialog(false);
  };

  const handleConfirmDialogCancel = () => {
    setShowConfirmDialog(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const approvalPercentage = Math.round(
    workingAgreement.approvals.length > 0
      ? (workingAgreement.approvals.filter(a => a.approved).length / workingAgreement.approvals.length) * 100
      : 0
  );

  const getBacklogTypeLabel = (type: string) => {
    switch (type) {
      case 'digital-product-journey':
        return 'Digital Product Journey';
      case 'azure-devops':
        return 'Azure DevOps';
      case 'aha':
        return 'Aha!';
      case 'other':
        return 'Other';
      default:
        return type;
    }
  };

  const getInfoLinkTypeLabel = (type: string) => {
    switch (type) {
      case 'sharepoint':
        return 'SharePoint';
      case 'wiki':
        return 'Wiki';
      case 'documentation':
        return 'Documentation';
      case 'teams-channel':
        return 'Teams Channel';
      case 'other':
        return 'Other';
      default:
        return type;
    }
  };

  const getInfoLinkTypeIcon = (type: string) => {
    switch (type) {
      case 'sharepoint':
        return <FileSymlink className="h-4 w-4 text-blue-500" />;
      case 'wiki':
        return <FileText className="h-4 w-4 text-purple-500" />;
      case 'documentation':
        return <FileText className="h-4 w-4 text-green-500" />;
      case 'teams-channel':
        return <MessageSquare className="h-4 w-4 text-blue-600" />;
      case 'other':
        return <Globe className="h-4 w-4 text-gray-500" />;
      default:
        return <Link className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={sidebarActiveTab} setActiveTab={setSidebarActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <RouterLink to={teamId ? `/teams/${teamId}` : "/"} className="text-blue-600 hover:text-blue-800 mr-4">
                <ArrowLeft size={20} />
              </RouterLink>
              <h1 className="text-xl font-semibold text-gray-900 flex items-center">
                {logoUrl && (
                  <div className="h-8 w-8 rounded-md overflow-hidden mr-2">
                    <img 
                      src={logoUrl} 
                      alt="Team logo"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                {!logoUrl && <Users className="h-6 w-6 mr-2 text-blue-500" />}
                Team Setup
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              {workingAgreement.status === 'draft' && (
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                  Draft
                </span>
              )}
              {workingAgreement.status === 'active' && (
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                  Active
                </span>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    {isTitleEditing ? (
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
                        />
                        <button 
                          onClick={handleTitleSave}
                          className="ml-2 p-1 text-green-600 hover:text-green-800"
                        >
                          <Save size={18} />
                        </button>
                        <button 
                          onClick={() => {
                            setTitle(workingAgreement.title);
                            setIsTitleEditing(false);
                          }}
                          className="ml-1 p-1 text-red-600 hover:text-red-800"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <h2 className="text-lg font-medium text-gray-900">{workingAgreement.title}</h2>
                        <button 
                          onClick={() => setIsTitleEditing(true)}
                          className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Edit3 size={16} />
                        </button>
                      </div>
                    )}
                    
                    {isDescriptionEditing ? (
                      <div className="mt-2 flex items-start">
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={2}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        <div className="ml-2 flex flex-col">
                          <button 
                            onClick={handleDescriptionSave}
                            className="p-1 text-green-600 hover:text-green-800"
                          >
                            <Save size={18} />
                          </button>
                          <button 
                            onClick={() => {
                              setDescription(workingAgreement.description);
                              setIsDescriptionEditing(false);
                            }}
                            className="mt-1 p-1 text-red-600 hover:text-red-800"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-1 flex items-start">
                        <p className="text-sm text-gray-500">{workingAgreement.description}</p>
                        <button 
                          onClick={() => setIsDescriptionEditing(true)}
                          className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Edit3 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-3 flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Last updated: {formatDate(workingAgreement.lastUpdated)}</span>
                </div>

                {/* Platform and Unit Section */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Layers className="h-4 w-4 mr-1 text-blue-500" />
                      <h3 className="text-sm font-medium text-gray-900">Platform & Unit</h3>
                    </div>
                    {!isPlatformEditing && (
                      <button
                        onClick={handleEditPlatform}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <Edit3 size={16} className="mr-1" />
                        Edit
                      </button>
                    )}
                  </div>

                  {isPlatformEditing ? (
                    <div className="space-y-4">
                      {/* Platform Selection */}
                      <div>
                        <label htmlFor="platform-select" className="block text-sm font-medium text-gray-700">
                          Platform <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1 relative">
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              placeholder="Search platforms..."
                              value={platformSearchQuery}
                              onChange={(e) => setPlatformSearchQuery(e.target.value)}
                              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          
                          <div className="mt-2 max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-sm">
                            {getFilteredPlatforms().map(platform => (
                              <div
                                key={platform}
                                className={`flex items-center p-2 cursor-pointer hover:bg-blue-50 ${
                                  selectedPlatform === platform ? 'bg-blue-50' : ''
                                }`}
                                onClick={() => handlePlatformSelect(platform)}
                              >
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900">{platform}</p>
                                  <p className="text-xs text-gray-500">{getPlatformCategory(platform)}</p>
                                </div>
                                {selectedPlatform === platform && (
                                  <div className="ml-auto">
                                    <CheckCircle className="h-5 w-5 text-blue-500" />
                                  </div>
                                )}
                              </div>
                            ))}
                            
                            {getFilteredPlatforms().length === 0 && (
                              <div className="p-4 text-center text-gray-500">
                                No platforms found matching your search
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Unit Selection (only if platform is selected) */}
                      {selectedPlatform && (
                        <div>
                          <label htmlFor="unit-select" className="block text-sm font-medium text-gray-700">
                            Unit (Optional)
                          </label>
                          <div className="mt-1 relative">
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                              </div>
                              <input
                                type="text"
                                placeholder="Search units..."
                                value={unitSearchQuery}
                                onChange={(e) => setUnitSearchQuery(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              />
                            </div>
                            
                            <div className="mt-2 max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-sm">
                              {getFilteredUnits().map(unit => (
                                <div
                                  key={unit}
                                  className={`flex items-center p-2 cursor-pointer hover:bg-blue-50 ${
                                    selectedUnit === unit ? 'bg-blue-50' : ''
                                  }`}
                                  onClick={() => handleUnitSelect(unit)}
                                >
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">{unit}</p>
                                  </div>
                                  {selectedUnit === unit && (
                                    <div className="ml-auto">
                                      <CheckCircle className="h-5 w-5 text-blue-500" />
                                    </div>
                                  )}
                                </div>
                              ))}
                              
                              {getFilteredUnits().length === 0 && (
                                <div className="p-4 text-center text-gray-500">
                                  No units found matching your search
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-2 pt-2">
                        <button
                          onClick={handleSavePlatformUnit}
                          disabled={!selectedPlatform}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                        >
                          <Save size={16} className="mr-1" />
                          Save
                        </button>
                        <button
                          onClick={handleCancelPlatformEdit}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <X size={16} className="mr-1" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm font-medium text-gray-700 flex items-center">
                            <Layers className="h-4 w-4 mr-1 text-gray-500" />
                            Platform
                          </div>
                          {selectedPlatform ? (
                            <div className="mt-1">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPlatformColor(selectedPlatform)}`}>
                                {selectedPlatform}
                              </span>
                              <p className="mt-1 text-xs text-gray-500">
                                Category: {getPlatformCategory(selectedPlatform)}
                              </p>
                            </div>
                          ) : (
                            <p className="mt-1 text-sm text-gray-500">No platform selected</p>
                          )}
                        </div>
                        
                        <div>
                          <div className="text-sm font-medium text-gray-700 flex items-center">
                            <Building className="h-4 w-4 mr-1 text-gray-500" />
                            Unit
                          </div>
                          {selectedUnit ? (
                            <div className="mt-1">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                {selectedUnit}
                              </span>
                            </div>
                          ) : (
                            <p className="mt-1 text-sm text-gray-500">No unit selected</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Team Logo Section */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center mb-2">
                    <Image className="h-4 w-4 mr-1 text-blue-500" />
                    <h3 className="text-sm font-medium text-gray-900">Team Logo</h3>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="h-20 w-20 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50">
                      {logoUrl ? (
                        <img 
                          src={logoUrl} 
                          alt="Team logo" 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Image className="h-8 w-8 text-gray-300" />
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <button
                        onClick={handleLogoModalOpen}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Upload size={14} className="mr-1" />
                        {logoUrl ? 'Change Logo' : 'Add Logo'}
                      </button>
                      
                      {logoUrl && (
                        <button
                          onClick={() => {
                            showConfirmationDialog(
                              'Remove Team Logo',
                              'Are you sure you want to remove the team logo?',
                              () => {
                                setLogoUrl('');
                                updateTeamLogo('');
                              }
                            );
                          }}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Trash size={14} className="mr-1" />
                          Remove Logo
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Business Capabilities Section */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-1 text-blue-500" />
                      <h3 className="text-sm font-medium text-gray-900">Business Capabilities</h3>
                      <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {getSelectedCapabilitiesCount()} selected
                      </span>
                    </div>
                    <button
                      onClick={() => setIsCapabilitiesExpanded(!isCapabilitiesExpanded)}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      {isCapabilitiesExpanded ? (
                        <>
                          <ChevronUp size={16} className="mr-1" />
                          Collapse
                        </>
                      ) : (
                        <>
                          <ChevronDown size={16} className="mr-1" />
                          Expand
                        </>
                      )}
                    </button>
                  </div>

                  {isCapabilitiesExpanded ? (
                    <div className="mt-3 space-y-4">
                      <div className="flex items-center space-x-2">
                        <div className="relative flex-1">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            placeholder="Search capabilities..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                        <div className="flex rounded-md shadow-sm">
                          <button
                            onClick={() => setActiveCapabilityCategory('core')}
                            className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                              activeCapabilityCategory === 'core'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            Core
                          </button>
                          <button
                            onClick={() => setActiveCapabilityCategory('enabling')}
                            className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                              activeCapabilityCategory === 'enabling'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            Enabling
                          </button>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-md p-4 max-h-96 overflow-y-auto">
                        {Object.entries(getCapabilitiesByDomain(filteredCapabilities(activeCapabilityCategory))).map(([domain, capabilities]) => (
                          <div key={domain} className="mb-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">{domain}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                              {capabilities.map((capability) => (
                                <div
                                  key={capability.id}
                                  className={`p-3 rounded-md border ${
                                    selectedCapabilities.includes(capability.id)
                                      ? 'border-blue-500 bg-blue-50'
                                      : 'border-gray-200 bg-white'
                                  } hover:border-blue-300 cursor-pointer transition-colors`}
                                  onClick={() => handleCapabilityToggle(capability.id)}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">{capability.name}</span>
                                    <div className={`h-4 w-4 rounded-full flex items-center justify-center ${
                                      selectedCapabilities.includes(capability.id)
                                        ? 'bg-blue-500 text-white'
                                        : 'border border-gray-300'
                                    }`}>
                                      {selectedCapabilities.includes(capability.id) && (
                                        <CheckCircle className="h-3 w-3" />
                                      )}
                                    </div>
                                  </div>
                                  {capability.description && (
                                    <p className="text-xs text-gray-500 mt-1">{capability.description}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}

                        {filteredCapabilities(activeCapabilityCategory).length === 0 && (
                          <div className="text-center py-8">
                            <p className="text-gray-500">No capabilities found matching your search.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2">
                      {selectedCapabilities.length > 0 ? (
                        <div className="bg-gray-50 rounded-md p-3">
                          <div className="flex flex-wrap gap-2">
                            {selectedCapabilities.map(capId => {
                              const capability = getCapabilityById(capId);
                              return capability ? (
                                <div 
                                  key={capId}
                                  className="bg-white px-3 py-1 rounded-full border border-gray-200 text-sm flex items-center"
                                >
                                  <span>{capability.name}</span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCapabilityToggle(capId);
                                    }}
                                    className="ml-2 text-gray-400 hover:text-red-500"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ) : null;
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4 bg-gray-50 rounded-md">
                          <p className="text-sm text-gray-500">No business capabilities selected</p>
                          <p className="text-xs text-gray-400 mt-1">Click "Expand" to select the capabilities your team is responsible for</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Backlog Management Link Section */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center mb-2">
                    <Link className="h-4 w-4 mr-1 text-blue-500" />
                    <h3 className="text-sm font-medium text-gray-900">Backlog Management</h3>
                  </div>
                  
                  {isBacklogLinkEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label htmlFor="backlog-url" className="block text-xs font-medium text-gray-700">
                          Backlog URL
                        </label>
                        <input
                          type="url"
                          id="backlog-url"
                          value={backlogUrl}
                          onChange={(e) => setBacklogUrl(e.target.value)}
                          placeholder="https://..."
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="backlog-type" className="block text-xs font-medium text-gray-700">
                          Tool
                        </label>
                        <select
                          id="backlog-type"
                          value={backlogType}
                          onChange={(e) => setBacklogType(e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          <option value="digital-product-journey">Digital Product Journey</option>
                          <option value="azure-devops">Azure DevOps</option>
                          <option value="aha">Aha!</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={handleBacklogLinkSave}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Save size={14} className="mr-1" />
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setBacklogUrl(team?.backlogLink?.url || '');
                            setBacklogType(team?.backlogLink?.type || 'digital-product-journey');
                            setIsBacklogLinkEditing(false);
                          }}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <X size={14} className="mr-1" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {backlogUrl ? (
                        <div className="text-sm">
                          <div className="flex items-center">
                            <span className="font-medium">Tool:</span>
                            <span className="ml-2">{getBacklogTypeLabel(backlogType)}</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <span className="font-medium">URL:</span>
                            <a 
                              href={backlogUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="ml-2 text-blue-600 hover:text-blue-800 hover:underline truncate max-w-md"
                            >
                              {backlogUrl}
                            </a>
                          </div>
                          <button
                            onClick={() => setIsBacklogLinkEditing(true)}
                            className="mt-2 inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 hover:text-blue-800"
                          >
                            <Edit3 size={12} className="mr-1" />
                            Edit
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-500">No backlog link configured</span>
                            <button
                              onClick={() => setIsBacklogLinkEditing(true)}
                              className="ml-2 inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 hover:text-blue-800"
                            >
                              <PlusCircle size={12} className="mr-1" />
                              Add Link
                            </button>
                          </div>
                          
                          {/* Digital Product Journey Documentation Link */}
                          <div className="bg-blue-50 border border-blue-100 rounded-md p-3">
                            <div className="flex items-start">
                              <HelpCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                              <div>
                                <h4 className="text-sm font-medium text-blue-800">Need a backlog management tool?</h4>
                                <p className="mt-1 text-sm text-blue-700">
                                  Get started with Digital Product Journey, our recommended tool for teams to plan and manage their work.
                                </p>
                                <a 
                                  href={DPJ_DOCUMENTATION_URL}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-2 inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                  <Link size={12} className="mr-1" />
                                  View Digital Product Journey documentation
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Team Information Links Section */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <FileSymlink className="h-4 w-4 mr-1 text-blue-500" />
                      <h3 className="text-sm font-medium text-gray-900">Team Information Links</h3>
                    </div>
                    {!isAddingInfoLink && !editingInfoLinkId && (
                      <button
                        onClick={handleAddInfoLink}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 hover:text-blue-800"
                      >
                        <PlusCircle size={12} className="mr-1" />
                        Add Link
                      </button>
                    )}
                  </div>

                  {(isAddingInfoLink || editingInfoLinkId) ? (
                    <div className="bg-gray-50 p-3 rounded-md space-y-3">
                      <div>
                        <label htmlFor="info-link-title" className="block text-xs font-medium text-gray-700">
                          Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="info-link-title"
                          value={infoLinkTitle}
                          onChange={(e) => setInfoLinkTitle(e.target.value)}
                          placeholder="Team SharePoint"
                          className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                            infoLinkErrors.title ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                        {infoLinkErrors.title && (
                          <p className="mt-1 text-xs text-red-600">{infoLinkErrors.title}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="info-link-url" className="block text-xs font-medium text-gray-700">
                          URL <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="url"
                          id="info-link-url"
                          value={infoLinkUrl}
                          onChange={(e) => setInfoLinkUrl(e.target.value)}
                          placeholder="https://..."
                          className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                            infoLinkErrors.url ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                        {infoLinkErrors.url && (
                          <p className="mt-1 text-xs text-red-600">{infoLinkErrors.url}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="info-link-type" className="block text-xs font-medium text-gray-700">
                          Type
                        </label>
                        <select
                          id="info-link-type"
                          value={infoLinkType}
                          onChange={(e) => setInfoLinkType(e.target.value as any)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          <option value="sharepoint">SharePoint</option>
                          <option value="wiki">Wiki</option>
                          <option value="documentation">Documentation</option>
                          <option value="teams-channel">Teams Channel</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="info-link-description" className="block text-xs font-medium text-gray-700">
                          Description (optional)
                        </label>
                        <textarea
                          id="info-link-description"
                          value={infoLinkDescription}
                          onChange={(e) => setInfoLinkDescription(e.target.value)}
                          rows={2}
                          placeholder="Brief description of this resource"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveInfoLink}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Save size={14} className="mr-1" />
                          Save
                        </button>
                        <button
                          onClick={handleCancelInfoLink}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <X size={14} className="mr-1" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {workingAgreement.teamInfoLinks && workingAgreement.teamInfoLinks.length > 0 ? (
                        <div className="space-y-3">
                          {workingAgreement.teamInfoLinks.map((link) => (
                            <div key={link.id} className="bg-gray-50 p-3 rounded-md">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  {getInfoLinkTypeIcon(link.type)}
                                  <h4 className="ml-2 text-sm font-medium text-gray-900">{link.title}</h4>
                                  <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                                    {getInfoLinkTypeLabel(link.type)}
                                  </span>
                                </div>
                                <div className="flex space-x-1">
                                  <button
                                    onClick={() => handleEditInfoLink(link)}
                                    className="p-1 text-blue-600 hover:text-blue-800"
                                    title="Edit link"
                                  >
                                    <Edit3 size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteInfoLink(link.id)}
                                    className="p-1 text-red-600 hover:text-red-800"
                                    title="Delete link"
                                  >
                                    <Trash size={14} />
                                  </button>
                                </div>
                              </div>
                              {link.description && (
                                <p className="mt-1 text-xs text-gray-500">{link.description}</p>
                              )}
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1 block text-sm text-blue-600 hover:text-blue-800 hover:underline truncate"
                              >
                                {link.url}
                              </a>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 bg-gray-50 rounded-md">
                          <p className="text-sm text-gray-500">No team information links added yet</p>
                          <p className="text-xs text-gray-400 mt-1">Add links to your team's SharePoint, wiki, or other important resources</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab('editor')}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === 'editor'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <FileText className="h-5 w-5 inline mr-1" />
                    Editor
                  </button>
                  <button
                    onClick={() => setActiveTab('team-members')}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === 'team-members'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Users className="h-5 w-5 inline mr-1" />
                    Team Members ({teamMembers.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === 'preview'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Eye className="h-5 w-5 inline mr-1" />
                    Preview
                  </button>
                  <button
                    onClick={() => setActiveTab('approvals')}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === 'approvals'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <CheckCircle className="h-5 w-5 inline mr-1" />
                    Approvals ({workingAgreement.approvals.filter(a => a.approved).length}/{workingAgreement.approvals.length})
                  </button>
                </nav>
              </div>
              
              {activeTab === 'editor' && (
                <div className="p-4">
                  {workingAgreement.sections.map((section) => (
                    <div key={section.id} className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                        {section.isEditing ? (
                          <input
                            type="text"
                            value={section.title}
                            onChange={(e) => handleSectionTitleChange(section.id, e.target.value)}
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        ) : (
                          <h3 className="text-sm font-medium text-gray-900">{section.title}</h3>
                        )}
                        
                        <div className="flex space-x-1">
                          {section.isEditing ? (
                            <>
                              <button 
                                onClick={() => handleSectionSave(section.id, section.content)}
                                className="p-1 text-green-600 hover:text-green-800"
                                title="Save changes"
                              >
                                <Save size={16} />
                              </button>
                              <button 
                                onClick={() => handleSectionCancel(section.id)}
                                className="p-1 text-red-600 hover:text-red-800"
                                title="Cancel editing"
                              >
                                <X size={16} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button 
                                onClick={() => handleSectionEdit(section.id)}
                                className="p-1 text-blue-600 hover:text-blue-800"
                                title="Edit section"
                              >
                                <Edit3 size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteSection(section.id)}
                                className="p-1 text-red-600 hover:text-red-800"
                                title="Delete section"
                              >
                                <Trash size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="px-4 py-3">
                        {section.isEditing ? (
                          <textarea
                            value={section.content}
                            onChange={(e) => {
                              setWorkingAgreement(prev => ({
                                ...prev,
                                sections: prev.sections.map(s => 
                                  s.id === section.id ? { ...s, content: e.target.value } : s
                                )
                              }));
                            }}
                            rows={5}
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        ) : (
                          <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line">
                            {section.content}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={handleAddSection}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Add New Section
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'team-members' && (
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Team Members</h3>
                    <button
                      onClick={handleAddTeamMember}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      Add Team Member
                    </button>
                  </div>

                  {/* Add/Edit Team Member Form */}
                  {(isAddingTeamMember || editingMemberId) && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-4">
                        {editingMemberId ? 'Edit Team Member' : 'Add Team Member'}
                      </h4>
                      
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="member-select" className="block text-sm font-medium text-gray-700">
                            Team Member <span className="text-red-500">*</span>
                          </label>
                          <div className="mt-1 relative">
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                              </div>
                              <input
                                type="text"
                                placeholder="Search members..."
                                value={memberSearchQuery}
                                onChange={(e) => setMemberSearchQuery(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              />
                            </div>
                            
                            <div className="mt-2 max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-sm">
                              {getFilteredAvailableMembers().map(member => (
                                <div
                                  key={member.id}
                                  className={`flex items-center p-2 cursor-pointer hover:bg-blue-50 ${
                                    selectedMemberId === member.id ? 'bg-blue-50' : ''
                                  }`}
                                  onClick={() => setSelectedMemberId(member.id)}
                                >
                                  <div className="flex-shrink-0">
                                    {member.avatar ? (
                                      <img 
                                        src={member.avatar} 
                                        alt={member.name} 
                                        className="h-8 w-8 rounded-full"
                                      />
                                    ) : (
                                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                        <Users className="h-4 w-4 text-gray-500" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">{member.name}</p>
                                    <p className="text-xs text-gray-500">{member.role}</p>
                                  </div>
                                  {selectedMemberId === member.id && (
                                    <div className="ml-auto">
                                      <CheckCircle className="h-5 w-5 text-blue-500" />
                                    </div>
                                  )}
                                </div>
                              ))}
                              
                              {getFilteredAvailableMembers().length === 0 && (
                                <div className="p-4 text-center text-gray-500">
                                  No members found matching your search
                                </div>
                              )}
                            </div>
                            
                            {memberErrors.member && (
                              <p className="mt-1 text-xs text-red-600">{memberErrors.member}</p>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="member-role" className="block text-sm font-medium text-gray-700">
                            Role on Team <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="member-role"
                            value={memberRole}
                            onChange={(e) => setMemberRole(e.target.value)}
                            placeholder="e.g., Developer, Scrum Master, Product Owner"
                            className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                              memberErrors.role ? 'border-red-300' : 'border-gray-300'
                            }`}
                          />
                          {memberErrors.role && (
                            <p className="mt-1 text-xs text-red-600">{memberErrors.role}</p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor="member-allocation" className="block text-sm font-medium text-gray-700">
                            Allocation (%)
                          </label>
                          <div className="mt-1 flex items-center">
                            <input
                              type="number"
                              id="member-allocation"
                              value={memberAllocation}
                              onChange={(e) => setMemberAllocation(Number(e.target.value))}
                              min="1"
                              max="100"
                              className={`block w-24 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                memberErrors.allocation ? 'border-red-300' : 'border-gray-300'
                              }`}
                            />
                            <Percent className="ml-2 h-4 w-4 text-gray-400" />
                            <span className="ml-2 text-sm text-gray-500">
                              {memberAllocation < 100 ? 'Part-time' : 'Full-time'}
                            </span>
                          </div>
                          {memberErrors.allocation && (
                            <p className="mt-1 text-xs text-red-600">{memberErrors.allocation}</p>
                          )}
                        </div>
                        
                        <div className="flex space-x-2 pt-2">
                          <button
                            onClick={handleSaveTeamMember}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <Save size={16} className="mr-1" />
                            {editingMemberId ? 'Update Member' : 'Add Member'}
                          </button>
                          <button
                            onClick={handleCancelTeamMember}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <X size={16} className="mr-1" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Team Members List */}
                  {teamMembers.length > 0 ? (
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                      <ul className="divide-y divide-gray-200">
                        {teamMembers.map((member) => (
                          <li key={member.id}>
                            <div className="px-4 py-4 flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="flex-shrink-0">
                                  {member.avatar ? (
                                    <img 
                                      src={member.avatar} 
                                      alt={member.name} 
                                      className="h-10 w-10 rounded-full"
                                    />
                                  ) : (
                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                      <Users className="h-5 w-5 text-gray-500" />
                                    </div>
                                  )}
                                </div>
                                <div className="ml-4">
                                  <div className="flex items-center">
                                    <h4 className="text-sm font-medium text-gray-900">{member.name}</h4>
                                    <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                      member.availability === 'available' ? 'bg-green-100 text-green-800' :
                                      member.availability === 'busy' ? 'bg-red-100 text-red-800' :
                                      member.availability === 'away' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {member.availability.charAt(0).toUpperCase() + member.availability.slice(1)}
                                    </span>
                                  </div>
                                  <div className="mt-1 flex items-center text-sm text-gray-500">
                                    <span className="truncate">{member.role || 'No role specified'}</span>
                                    <span className="mx-1">•</span>
                                    <span>{member.allocation || 100}% allocated</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEditTeamMember(member.id)}
                                  className="inline-flex items-center p-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  <Edit3 size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeleteTeamMember(member.id)}
                                  className="inline-flex items-center p-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  <Trash size={14} />
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                      <UserCheck className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No team members</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Get started by adding team members to your team.
                      </p>
                      <div className="mt-6">
                        <button
                          onClick={handleAddTeamMember}
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <UserPlus className="h-4 w-4 mr-1" />
                          Add Team Member
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'preview' && (
                <div className="p-6">
                  <div className="prose prose-blue max-w-none">
                    <h1>{workingAgreement.title}</h1>
                    <p className="text-gray-600">{workingAgreement.description}</p>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-6">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Last updated: {formatDate(workingAgreement.lastUpdated)}</span>
                      <span className="mx-2">•</span>
                      <span>Version {workingAgreement.version}</span>
                      <span className="mx-2">•</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        workingAgreement.status === 'draft' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : workingAgreement.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {workingAgreement.status.charAt(0).toUpperCase() + workingAgreement.status.slice(1)}
                      </span>
                    </div>
                    
                    {/* Platform and Unit in Preview */}
                    <div className="mb-6">
                      <h2 className="text-lg font-medium text-gray-900 mb-3">Team Organization</h2>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-700 flex items-center">
                              <Layers className="h-4 w-4 mr-1 text-blue-500" />
                              Platform
                            </h3>
                            {selectedPlatform ? (
                              <div className="mt-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPlatformColor(selectedPlatform)}`}>
                                  {selectedPlatform}
                                </span>
                                <p className="mt-1 text-xs text-gray-500">
                                  Category: {getPlatformCategory(selectedPlatform)}
                                </p>
                              </div>
                            ) : (
                              <p className="mt-2 text-sm text-gray-500">No platform selected</p>
                            )}
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium text-gray-700 flex items-center">
                              <Building className="h-4 w-4 mr-1 text-blue-500" />
                              Unit
                            </h3>
                            {selectedUnit ? (
                              <div className="mt-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                  {selectedUnit}
                                </span>
                              </div>
                            ) : (
                              <p className="mt-2 text-sm text-gray-500">No unit selected</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Team Members in Preview */}
                    <div className="mb-6">
                      <h2 className="text-lg font-medium text-gray-900 mb-3">Team Members</h2>
                      {teamMembers.length > 0 ? (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {teamMembers.map(member => (
                              <div key={member.id} className="bg-white p-3 rounded-md border border-gray-200">
                                <div className="flex items-center">
                                  {member.avatar ? (
                                    <img 
                                      src={member.avatar} 
                                      alt={member.name} 
                                      className="h-8 w-8 rounded-full"
                                    />
                                  ) : (
                                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                      <Users className="h-4 w-4 text-gray-500" />
                                    </div>
                                  )}
                                  <div className="ml-3">
                                    <h3 className="text-sm font-medium">{member.name}</h3>
                                    <p className="text-xs text-gray-500">{member.role || 'No role specified'}</p>
                                  </div>
                                </div>
                                <div className="mt-2 text-xs text-gray-600">
                                  <div className="flex items-center justify-between">
                                    <span>Allocation:</span>
                                    <span className="font-medium">{member.allocation || 100}%</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500">No team members added yet.</p>
                      )}
                    </div>
                    
                    {/* Business Capabilities in Preview */}
                    <div className="mb-6">
                      <h2 className="text-lg font-medium text-gray-900 mb-3">Business Capabilities</h2>
                      {selectedCapabilities.length > 0 ? (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {selectedCapabilities.map(capId => {
                              const capability = getCapabilityById(capId);
                              return capability ? (
                                <div key={capId} className="bg-white p-3 rounded-md border border-gray-200">
                                  <div className="flex items-center">
                                    <Briefcase className="h-4 w-4 text-blue-500 mr-2" />
                                    <h3 className="text-sm font-medium">{capability.name}</h3>
                                  </div>
                                  <div className="mt-1 flex items-center">
                                    <span className="text-xs text-gray-500">{capability.domain}</span>
                                    <span className="mx-1 text-gray-300">•</span>
                                    <span className={`text-xs ${
                                      capability.category === 'core' ? 'text-blue-600' : 'text-green-600'
                                    }`}>
                                      {capability.category.charAt(0).toUpperCase() + capability.category.slice(1)}
                                    </span>
                                  </div>
                                  {capability.description && (
                                    <p className="mt-2 text-xs text-gray-600">{capability.description}</p>
                                  )}
                                </div>
                              ) : null;
                            })}
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500">No business capabilities selected.</p>
                      )}
                    </div>
                    
                    {/* Team Links in Preview */}
                    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Backlog Link in Preview */}
                      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="flex items-center mb-2">
                          <Link className="h-4 w-4 mr-1 text-blue-500" />
                          <h3 className="text-sm font-medium text-gray-900">Backlog Management</h3>
                        </div>
                        {backlogUrl ? (
                          <div className="text-sm">
                            <div className="flex items-center">
                              <span className="font-medium">Tool:</span>
                              <span className="ml-2">{getBacklogTypeLabel(backlogType)}</span>
                            </div>
                            <div className="flex items-center mt-1">
                              <span className="font-medium">URL:</span>
                              <a 
                                href={backlogUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="ml-2 text-blue-600 hover:text-blue-800 hover:underline truncate max-w-md"
                              >
                                {backlogUrl}
                              </a>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No backlog link configured</p>
                        )}
                      </div>

                      {/* Team Info Links in Preview */}
                      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="flex items-center mb-2">
                          <FileSymlink className="h-4 w-4 mr-1 text-blue-500" />
                          <h3 className="text-sm font-medium text-gray-900">Team Information</h3>
                        </div>
                        {workingAgreement.teamInfoLinks && workingAgreement.teamInfoLinks.length > 0 ? (
                          <div className="space-y-2">
                            {workingAgreement.teamInfoLinks.map((link) => (
                              <div key={link.id} className="text-sm">
                                <div className="flex items-center">
                                  {getInfoLinkTypeIcon(link.type)}
                                  <a 
                                    href={link.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="ml-2 text-blue-600 hover:text-blue-800 hover:underline truncate max-w-md"
                                  >
                                    {link.title}
                                  </a>
                                </div>
                                {link.description && (
                                  <p className="ml-6 text-xs text-gray-500 mt-0.5">{link.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No team information links configured</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {workingAgreement.sections.map((section) => (
                        <div key={section.id}>
                          <h2>{section.title}</h2>
                          <div className="whitespace-pre-line">{section.content}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'approvals' && (
                <div className="p-6">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-gray-900">Team Approvals</h3>
                      <span className="text-sm text-gray-500">{approvalPercentage}% Complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${approvalPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {workingAgreement.approvals.length > 0 ? (
                    <div className="overflow-hidden bg-white shadow sm:rounded-md">
                      <ul className="divide-y divide-gray-200">
                        {workingAgreement.approvals.map((approval) => (
                          <li key={approval.memberId}>
                            <div className="flex items-center px-4 py-4 sm:px-6">
                              <div className="min-w-0 flex-1 flex items-center">
                                <div className="flex-shrink-0">
                                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                    {approval.memberId.split(' ').map(name => name[0]).join('')}
                                  </div>
                                </div>
                                <div className="min-w-0 flex-1 px-4">
                                  <div>
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {approval.memberId}
                                    </p>
                                    {approval.approved ? (
                                      <p className="mt-1 flex items-center text-sm text-green-600">
                                        <CheckCircle className="flex-shrink-0 mr-1.5 h-4 w-4 text-green-500" />
                                        Approved {approval.approvedAt && `on ${formatDate(approval.approvedAt)}`}
                                      </p>
                                    ) : (
                                      <p className="mt-1 flex items-center text-sm text-gray-500">
                                        <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                        Pending approval
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div>
                                {!approval.approved && (
                                  <button
                                    onClick={() => handleApprove(approval.memberId)}
                                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                  >
                                    Approve
                                  </button>
                                )}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-md">
                      <p className="text-gray-500">No team members added for approval yet.</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Team members will appear here once they are added to the team.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex justify-between">
              <div className="flex space-x-2">
                <button
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </button>
                <button
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </button>
              </div>
              
              <div className="flex space-x-2">
                {workingAgreement.status === 'draft' && (
                  <button
                    onClick={handlePublish}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Publish Agreement
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Success message */}
      {showSuccessMessage && (
        <div className="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 shadow-md rounded-md flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error message */}
      {showErrorMessage && (
        <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 shadow-md rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">{confirmDialogTitle}</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{confirmDialogMessage}</p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={handleConfirmDialogConfirm}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={handleConfirmDialogCancel}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logo Upload/Generate Modal */}
      {isLogoModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Team Logo</h3>
                <button
                  onClick={handleLogoModalClose}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="px-6 py-4">
              <div className="flex flex-col md:flex-row md:space-x-6">
                {/* Upload Section */}
                <div className="flex-1 mb-6 md:mb-0">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Upload Logo</h4>
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
                    onClick={handleLogoUploadClick}
                  >
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, SVG (max 2MB)</p>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      className="hidden" 
                      accept="image/*"
                      onChange={handleLogoFileChange}
                    />
                  </div>
                </div>
                
                {/* AI Generate Section */}
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Generate with AI</h4>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="logo-prompt" className="block text-xs font-medium text-gray-700">
                        Describe your team logo <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="logo-prompt"
                        value={logoPrompt}
                        onChange={(e) => {
                          setLogoPrompt(e.target.value);
                          if (logoPromptError && e.target.value.trim()) {
                            setLogoPromptError(null);
                          }
                        }}
                        rows={3}
                        placeholder="E.g., A modern logo for a software development team with blue and green colors"
                        className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                          logoPromptError ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {logoPromptError && (
                        <p className="mt-1 text-xs text-red-600">{logoPromptError}</p>
                      )}
                    </div>
                    
                    <button
                      onClick={handleGenerateLogo}
                      disabled={isGeneratingLogo}
                      className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                    >
                      {isGeneratingLogo ? (
                        <>
                          <span className="animate-spin mr-2">⟳</span>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} className="mr-2" />
                          Generate Logo
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Generated Logos Section */}
              {generatedLogos.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Generated Logos</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {generatedLogos.map((logo, index) => (
                      <div 
                        key={index}
                        className={`aspect-square border rounded-md overflow-hidden cursor-pointer ${
                          selectedGeneratedLogo === logo ? 'ring-2 ring-blue-500' : 'hover:border-blue-300'
                        }`}
                        onClick={() => handleSelectGeneratedLogo(logo)}
                      >
                        <img 
                          src={logo} 
                          alt={`Generated logo option ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  
                  {selectedGeneratedLogo && (
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={handleApplyGeneratedLogo}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <CheckCircle size={16} className="mr-2" />
                        Apply Selected Logo
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Assistant */}
      <AIAssistant />
    </div>
  );
};

export default TeamSetupPage;
