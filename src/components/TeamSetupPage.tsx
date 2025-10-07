import React, { useState, useEffect } from 'react';
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
  Trash
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { TeamWorkingAgreement, WorkingAgreementSection } from '../types';
import { defaultWorkingAgreement } from '../data/teamWorkingAgreementData';
import AIAssistant from './AIAssistant';
import Sidebar from './Sidebar';

const TeamSetupPage: React.FC = () => {
  const [workingAgreement, setWorkingAgreement] = useState<TeamWorkingAgreement>(defaultWorkingAgreement);
  const [title, setTitle] = useState(defaultWorkingAgreement.title);
  const [description, setDescription] = useState(defaultWorkingAgreement.description);
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'approvals'>('editor');
  const [sidebarActiveTab, setSidebarActiveTab] = useState('team-setup');

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
    if (confirm('Are you sure you want to delete this section?')) {
      setWorkingAgreement(prev => ({
        ...prev,
        sections: prev.sections.filter(section => section.id !== sectionId),
        lastUpdated: new Date().toISOString()
      }));
      showSuccess('Section deleted successfully');
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
    showSuccess('Working agreement published successfully');
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
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
    (workingAgreement.approvals.filter(a => a.approved).length / workingAgreement.approvals.length) * 100
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={sidebarActiveTab} setActiveTab={setSidebarActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="text-blue-600 hover:text-blue-800 mr-4">
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-xl font-semibold text-gray-900 flex items-center">
                <Users className="h-6 w-6 mr-2 text-blue-500" />
                Team Setup
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                workingAgreement.status === 'draft' 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : workingAgreement.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {workingAgreement.status.charAt(0).toUpperCase() + workingAgreement.status.slice(1)}
              </span>
              <span className="text-sm text-gray-500">
                v{workingAgreement.version}
              </span>
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
                    disabled={approvalPercentage < 50}
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

      {/* AI Assistant */}
      <AIAssistant />
    </div>
  );
};

export default TeamSetupPage;
