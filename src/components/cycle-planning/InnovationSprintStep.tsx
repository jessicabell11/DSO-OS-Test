import React, { useState } from 'react';
import { ExternalLink, ArrowLeft, ArrowRight, Lightbulb } from 'lucide-react';

interface InnovationSprintStepProps {
  innovationSprintUrl: string;
  setInnovationSprintUrl: React.Dispatch<React.SetStateAction<string>>;
  designAgentUrl: string;
  setDesignAgentUrl: React.Dispatch<React.SetStateAction<string>>;
  onNext: () => void;
  onBack: () => void;
}

const InnovationSprintStep: React.FC<InnovationSprintStepProps> = ({
  innovationSprintUrl,
  setInnovationSprintUrl,
  designAgentUrl,
  setDesignAgentUrl,
  onNext,
  onBack
}) => {
  const [sprintCompleted, setSprintCompleted] = useState(false);
  const [skipInnovationSprint, setSkipInnovationSprint] = useState(false);
  
  const handleOpenInnovationSprint = () => {
    // Open the innovation sprint URL in a new tab
    window.open("https://app.mural.co/t/bayer1789/template/b3788c3f-c31d-4870-9db6-c7b0ca085c4d", '_blank');
  };
  
  const handleSprintComplete = () => {
    setSprintCompleted(true);
  };

  const handleSkipSprint = () => {
    setSkipInnovationSprint(true);
  };
  
  // Removed the isNextDisabled condition to allow proceeding without completing the sprint

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-blue-500" />
              Step 2: Run an Innovation Sprint
            </h2>
            <button
              onClick={handleSkipSprint}
              className={`text-sm font-medium px-3 py-1 rounded-md ${
                skipInnovationSprint 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              {skipInnovationSprint ? 'Skipping this step' : 'Skip this step'}
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Use the Innovation Sprint template to ideate and create a concept for your upcoming cycle
          </p>
        </div>
        
        {!skipInnovationSprint ? (
          <div className="p-6">
            <div className="max-w-3xl mx-auto">
              <div className="mb-8">
                <h3 className="text-md font-medium text-gray-900 mb-2">What is an Innovation Sprint?</h3>
                <p className="text-sm text-gray-600">
                  An Innovation Sprint is a structured approach to rapidly generate and validate ideas. 
                  It helps teams think creatively about solutions to achieve their outcomes while 
                  ensuring they're focused on user needs and technical feasibility.
                </p>
              </div>
              
              {/* Innovation Sprint Instructions - Simplified */}
              <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 mb-6">
                <h3 className="text-md font-medium text-gray-900 mb-4">Run Your Innovation Sprint</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Use the Innovation Sprint template to ideate with your team. 
                  The template will guide you through a structured process to generate and validate ideas 
                  for your upcoming cycle.
                </p>
                
                <div className="flex items-center mb-6">
                  <button
                    onClick={handleOpenInnovationSprint}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 mr-3"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Innovation Sprint Template
                  </button>
                  
                  <button
                    onClick={handleSprintComplete}
                    disabled={sprintCompleted}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                      sprintCompleted ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {sprintCompleted ? (
                      <>
                        <span className="mr-2">✓</span>
                        Sprint Completed
                      </>
                    ) : (
                      'Mark Sprint as Completed'
                    )}
                  </button>
                </div>
              </div>
              
              {/* Design Agent URL Input - Updated text */}
              <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                <h3 className="text-md font-medium text-gray-900 mb-4">Design Concept</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Paste the URL below for the concept created during your Innovation Sprint.
                </p>
                
                <div className="mb-4">
                  <label htmlFor="design-agent-url" className="block text-sm font-medium text-gray-700 mb-1">
                    Design Agent URL
                  </label>
                  <input
                    type="text"
                    id="design-agent-url"
                    value={designAgentUrl}
                    onChange={(e) => setDesignAgentUrl(e.target.value)}
                    placeholder="https://preview.....cloud.bayer.com/"
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Paste the URL of the concept that you created during your Innovation Sprint.
                  </p>
                </div>
                
                {/* Added note about optional fields */}
                <div className="mt-2 text-xs text-gray-500 italic">
                  Note: You can continue to the next step without completing the Innovation Sprint or providing a Design Agent URL.
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="max-w-3xl mx-auto">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Innovation Sprint Skipped</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        You've chosen to skip the Innovation Sprint step. You can proceed directly to Backlog Planning.
                      </p>
                      <p className="mt-2">
                        If you change your mind, you can click "Don't skip this step" to return to the Innovation Sprint workflow.
                      </p>
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={() => setSkipInnovationSprint(false)}
                        className="inline-flex items-center px-3 py-1.5 border border-blue-300 text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                      >
                        Don't skip this step
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Outcomes
          </button>
          <button
            onClick={onNext}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Continue to Backlog Planning
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InnovationSprintStep;
