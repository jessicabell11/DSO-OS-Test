import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface StepperProps {
  steps: string[];
  currentStep?: number;
  onStepClick?: (index: number) => void;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep = 0, onStepClick }) => {
  const navigate = useNavigate();
  const { teamId } = useParams<{ teamId?: string }>();
  const containerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [topArcPath, setTopArcPath] = useState<string>('');
  const [bottomArcPath, setBottomArcPath] = useState<string>('');
  const [svgHeight, setSvgHeight] = useState<number>(200);
  
  useEffect(() => {
    // Ensure refs are populated before calculating
    const calculateArcPaths = () => {
      if (!stepRefs.current[3] || !stepRefs.current[5] || !containerRef.current) return;
      
      // Get the container's position
      const containerRect = containerRef.current.getBoundingClientRect();
      
      // Get positions of step 4 and step 6
      const step4 = stepRefs.current[3].getBoundingClientRect();
      const step6 = stepRefs.current[5].getBoundingClientRect();
      
      // Calculate relative positions to the container
      const step4X = step4.left - containerRect.left + step4.width / 2;
      const step4Y = step4.top - containerRect.top;
      const step4Bottom = step4.bottom - containerRect.top;
      const step6X = step6.left - containerRect.left + step6.width / 2;
      const step6Y = step6.top - containerRect.top;
      const step6Bottom = step6.bottom - containerRect.top;
      
      // Calculate control point for the top arc (higher above the steps)
      const topControlX = (step4X + step6X) / 2;
      const topControlY = Math.min(step4Y, step6Y) - 60; // 60px above for more pronounced arc
      
      // Create the top SVG path (step 4 to step 6)
      const topPath = `M ${step4X} ${step4Y} Q ${topControlX} ${topControlY}, ${step6X} ${step6Y}`;
      setTopArcPath(topPath);
      
      // Calculate control point for the bottom arc (lower below the steps)
      const bottomControlX = (step4X + step6X) / 2;
      const bottomControlY = Math.max(step4Bottom, step6Bottom) + 60; // 60px below for more pronounced arc
      
      // Create the bottom SVG path (step 6 back to step 4)
      const bottomPath = `M ${step6X} ${step6Bottom} Q ${bottomControlX} ${bottomControlY}, ${step4X} ${step4Bottom}`;
      setBottomArcPath(bottomPath);
      
      // Set SVG height to accommodate both arcs
      const maxHeight = containerRect.height + Math.max(Math.abs(topControlY), Math.abs(bottomControlY - containerRect.height)) + 40;
      setSvgHeight(maxHeight);
    };
    
    // Use a small delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      calculateArcPaths();
      window.addEventListener('resize', calculateArcPaths);
    }, 200);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculateArcPaths);
    };
  }, [steps]); // Recalculate when steps change
  
  const handleStepClick = (index: number) => {
    // If parent component provided an onStepClick handler, use that
    if (onStepClick) {
      onStepClick(index);
      return;
    }
    
    // Otherwise, handle navigation internally
    // Navigate to Long & Mid-Term Outcomes when clicking on step #1 (index 0)
    if (index === 0) {
      if (teamId) {
        navigate(`/teams/${teamId}/long-mid-term-outcomes`);
      } else {
        navigate('/long-mid-term-outcomes');
      }
    }
    // Navigate to Team Setup page when clicking on step #2 (index 1)
    else if (index === 1) {
      if (teamId) {
        navigate(`/teams/${teamId}/team-setup`);
      } else {
        navigate('/team-setup');
      }
    }
    // Navigate to 90-Day Cycle Plan when clicking on step #3 (index 2)
    else if (index === 2) {
      if (teamId) {
        navigate(`/teams/${teamId}/90-day-cycle`);
      } else {
        navigate('/90-day-cycle');
      }
    }
    // Navigate to Sprint Plan when clicking on step #4 (index 3)
    else if (index === 3) {
      if (teamId) {
        navigate(`/teams/${teamId}/sprint-plan`);
      } else {
        navigate('/sprint-plan');
      }
    }
    // Navigate to Daily Standup when clicking on step #5 (index 4)
    else if (index === 4) {
      if (teamId) {
        navigate(`/teams/${teamId}/daily-standup`);
      } else {
        navigate('/daily-standup');
      }
    }
    // Navigate to Sprint Review & Demo when clicking on step #6 (index 5)
    else if (index === 5) {
      if (teamId) {
        navigate(`/teams/${teamId}/sprint-review`);
      } else {
        navigate('/sprint-review');
      }
    }
    // Navigate to 90-Day Cycle Retrospective when clicking on step #7 (index 6)
    else if (index === 6) {
      if (teamId) {
        navigate(`/teams/${teamId}/cycle-retrospective`);
      } else {
        navigate('/cycle-retrospective');
      }
    }
  };
  
  return (
    <div className="py-12 relative" ref={containerRef}>
      {/* SVG for both arched lines */}
      <svg 
        className="absolute top-0 left-0 w-full pointer-events-none" 
        style={{ height: `${svgHeight}px`, zIndex: 10 }}
      >
        {/* Top arc - step 4 to step 6 */}
        <path
          d={topArcPath}
          fill="none"
          stroke="#3B82F6" // blue-500
          strokeWidth="2"
          strokeDasharray="5,5" // Dashed line
          className="transition-all duration-300"
        />
        {/* Arrow at the end of the top arc */}
        {topArcPath && (
          <polygon 
            points="0,-4 8,0 0,4" 
            fill="#3B82F6"
            className="transition-all duration-300"
            transform={`translate(${topArcPath.split(' ').slice(-2)[0]},${topArcPath.split(' ').slice(-1)[0]}) rotate(90)`}
          />
        )}
        
        {/* Bottom arc - step 6 back to step 4 */}
        <path
          d={bottomArcPath}
          fill="none"
          stroke="#3B82F6" // blue-500
          strokeWidth="2"
          strokeDasharray="5,5" // Dashed line
          className="transition-all duration-300"
        />
        {/* Arrow at the end of the bottom arc */}
        {bottomArcPath && (
          <polygon 
            points="0,-4 8,0 0,4" 
            fill="#3B82F6"
            className="transition-all duration-300"
            transform={`translate(${bottomArcPath.split(' ').slice(-2)[0]},${bottomArcPath.split(' ').slice(-1)[0]}) rotate(-90)`}
          />
        )}
      </svg>
      
      <div className="flex items-start justify-between w-full">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {/* Step circle */}
            <div 
              className="flex flex-col items-center relative"
              ref={el => stepRefs.current[index] = el}
            >
              <div 
                className={`flex items-center justify-center w-12 h-12 rounded-full border-2 
                  ${index <= currentStep 
                    ? 'border-blue-500 bg-blue-500 text-white' 
                    : 'border-gray-300 bg-white text-gray-500'}
                  cursor-pointer hover:border-blue-600`}
                onClick={() => handleStepClick(index)}
              >
                <span className="flex items-center justify-center text-sm leading-none">
                  {index + 1}
                </span>
              </div>
              <div 
                className="mt-4 text-sm text-center max-w-[100px] cursor-pointer hover:text-blue-600"
                onClick={() => handleStepClick(index)}
              >
                {step}
              </div>
              
              {/* Special indicators for connected steps - top */}
              {(index === 3 || index === 5) && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 -translate-y-full">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
              )}
              
              {/* Special indicators for connected steps - bottom */}
              {(index === 3 || index === 5) && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 translate-y-full">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
              )}
            </div>
            
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div 
                className={`flex-1 h-1 mx-4 mt-6 
                  ${index < currentStep ? 'bg-blue-500' : 'bg-gray-300'}`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Stepper;
