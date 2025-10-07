import React from 'react';
import { TrendingUp, TrendingDown, Minus, Clock, Repeat, AlertTriangle, Activity, Shield, FileWarning, Layers, Code, GitBranch, Server, DollarSign, Users, Heart, Target, Network, Gift, Zap } from 'lucide-react';
import { ProgressData } from '../types';

interface ProgressSectionProps {
  progress: ProgressData;
}

const ProgressSection: React.FC<ProgressSectionProps> = ({ progress }) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={16} className="text-green-500" />;
      case 'down':
        return <TrendingDown size={16} className="text-red-500" />;
      case 'flat':
      default:
        return <Minus size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      case 'neutral':
      default:
        return 'text-yellow-600';
    }
  };

  const calculatePercentage = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const getProgressBarColor = (status: string, percentage: number) => {
    if (status === 'positive') {
      return 'bg-green-500';
    } else if (status === 'negative') {
      return 'bg-red-500';
    } else {
      return percentage >= 80 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500';
    }
  };

  // For Lead Time and Mean Time to Recover, lower is better, so we need to invert the percentage calculation
  const calculateInvertedPercentage = (current: number, target: number) => {
    // If current is higher than target (worse), we calculate how far we are from target
    if (current > target) {
      // Cap at 100% (meaning we're at 0% progress)
      const overagePercentage = Math.min(((current - target) / target) * 100, 100);
      return Math.max(100 - overagePercentage, 0);
    }
    // If current is lower than target (better), we're at 100%
    return 100;
  };

  // For Deployment Frequency, higher is better
  const calculateDeploymentFrequencyPercentage = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  // For Change Failure Rate, lower is better
  const calculateChangeFailureRatePercentage = (current: number, target: number) => {
    return calculateInvertedPercentage(current, target);
  };

  // For Vulnerability Count, lower is better
  const calculateVulnerabilityCountPercentage = (current: number, target: number) => {
    // Target is 0, so we need a special calculation
    if (target === 0) {
      // If current is 0, we're at 100%
      if (current === 0) return 100;
      // Otherwise, we're at some percentage based on how far we are from a reasonable maximum (e.g., 50)
      const reasonableMaximum = 50;
      return Math.max(0, 100 - (current / reasonableMaximum) * 100);
    }
    return calculateInvertedPercentage(current, target);
  };

  // Time to Market section (DORA metrics)
  const renderDoraMetrics = () => {
    // Add null checks to prevent errors when accessing properties
    if (!progress || !progress.leadTimeForChanges || !progress.deploymentFrequency) {
      return (
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900">Time to Market</h3>
          <p className="text-sm text-gray-500">Loading metrics data...</p>
        </div>
      );
    }
    
    const leadTimePercentage = calculateInvertedPercentage(
      progress.leadTimeForChanges.current, 
      progress.leadTimeForChanges.target
    );
    
    const deploymentFrequencyPercentage = calculateDeploymentFrequencyPercentage(
      progress.deploymentFrequency.current,
      progress.deploymentFrequency.target
    );
    
    const leadTimeBarColor = getProgressBarColor(progress.leadTimeForChanges.status, leadTimePercentage);
    const deploymentFrequencyBarColor = getProgressBarColor(progress.deploymentFrequency.status, deploymentFrequencyPercentage);
    
    return (
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-900">Time to Market</h3>
          <div className="flex items-center">
            {getTrendIcon(progress.deploymentFrequency.trend)}
            <span className={`ml-1 text-sm ${getStatusColor(progress.deploymentFrequency.status)}`}>
              {progress.deploymentFrequency.trend === 'up' ? '+' : ''}{Math.abs(progress.deploymentFrequency.current - progress.deploymentFrequency.previousPeriod).toFixed(1)}
            </span>
          </div>
        </div>
        <p className="mt-1 text-sm text-gray-500">Speed of delivering code changes to production</p>
        
        {/* Lead Time for Changes */}
        <div className="mt-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <Clock size={16} className="text-blue-700 mr-2" />
              <h4 className="text-sm font-medium text-gray-900">{progress.leadTimeForChanges.name}</h4>
            </div>
            <div className="flex items-center">
              {getTrendIcon(progress.leadTimeForChanges.trend)}
              <span className={`ml-1 text-xs ${getStatusColor(progress.leadTimeForChanges.status)}`}>
                {progress.leadTimeForChanges.trend === 'down' ? '-' : '+'}{Math.abs(progress.leadTimeForChanges.current - progress.leadTimeForChanges.previousPeriod).toFixed(1)} days
              </span>
            </div>
          </div>
          
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-700">
                Current: {progress.leadTimeForChanges.current} days
              </span>
              <span className="text-xs font-medium text-gray-700">
                Target: {progress.leadTimeForChanges.target} days
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${leadTimeBarColor}`} 
                style={{ width: `${leadTimePercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Deployment Frequency */}
        <div className="mt-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <Repeat size={16} className="text-blue-700 mr-2" />
              <h4 className="text-sm font-medium text-gray-900">{progress.deploymentFrequency.name}</h4>
            </div>
            <div className="flex items-center">
              {getTrendIcon(progress.deploymentFrequency.trend)}
              <span className={`ml-1 text-xs ${getStatusColor(progress.deploymentFrequency.status)}`}>
                {progress.deploymentFrequency.trend === 'up' ? '+' : '-'}{Math.abs(progress.deploymentFrequency.current - progress.deploymentFrequency.previousPeriod).toFixed(1)}/month
              </span>
            </div>
          </div>
          
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-700">
                Current: {progress.deploymentFrequency.current}/month
              </span>
              <span className="text-xs font-medium text-gray-700">
                Target: {progress.deploymentFrequency.target}/month
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${deploymentFrequencyBarColor}`} 
                style={{ width: `${deploymentFrequencyPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Quality & Reliability section with DORA metrics
  const renderQualityReliability = () => {
    // Add null checks to prevent errors when accessing properties
    if (!progress || !progress.meanTimeToRecover || !progress.changeFailureRate) {
      return (
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900">Quality & Reliability</h3>
          <p className="text-sm text-gray-500">Loading metrics data...</p>
        </div>
      );
    }
    
    const mttrPercentage = calculateInvertedPercentage(
      progress.meanTimeToRecover.current, 
      progress.meanTimeToRecover.target
    );
    
    const changeFailureRatePercentage = calculateChangeFailureRatePercentage(
      progress.changeFailureRate.current,
      progress.changeFailureRate.target
    );
    
    const mttrBarColor = getProgressBarColor(progress.meanTimeToRecover.status, mttrPercentage);
    const changeFailureRateBarColor = getProgressBarColor(progress.changeFailureRate.status, changeFailureRatePercentage);
    
    return (
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-900">Quality & Reliability</h3>
          <div className="flex items-center">
            {getTrendIcon(progress.qualityReliability.trend)}
            <span className={`ml-1 text-sm ${getStatusColor(progress.qualityReliability.status)}`}>
              {progress.qualityReliability.trend === 'up' ? '+' : ''}{Math.abs(progress.qualityReliability.current - progress.qualityReliability.previousPeriod).toFixed(1)}
            </span>
          </div>
        </div>
        <p className="mt-1 text-sm text-gray-500">{progress.qualityReliability.description}</p>
        
        {/* Mean Time to Recover */}
        <div className="mt-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <Activity size={16} className="text-blue-700 mr-2" />
              <h4 className="text-sm font-medium text-gray-900">{progress.meanTimeToRecover.name}</h4>
            </div>
            <div className="flex items-center">
              {getTrendIcon(progress.meanTimeToRecover.trend)}
              <span className={`ml-1 text-xs ${getStatusColor(progress.meanTimeToRecover.status)}`}>
                {progress.meanTimeToRecover.trend === 'down' ? '-' : '+'}{Math.abs(progress.meanTimeToRecover.current - progress.meanTimeToRecover.previousPeriod).toFixed(1)} hrs
              </span>
            </div>
          </div>
          
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-700">
                Current: {progress.meanTimeToRecover.current} hrs
              </span>
              <span className="text-xs font-medium text-gray-700">
                Target: {progress.meanTimeToRecover.target} hrs
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${mttrBarColor}`} 
                style={{ width: `${mttrPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Change Failure Rate */}
        <div className="mt-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <AlertTriangle size={16} className="text-blue-700 mr-2" />
              <h4 className="text-sm font-medium text-gray-900">{progress.changeFailureRate.name}</h4>
            </div>
            <div className="flex items-center">
              {getTrendIcon(progress.changeFailureRate.trend)}
              <span className={`ml-1 text-xs ${getStatusColor(progress.changeFailureRate.status)}`}>
                {progress.changeFailureRate.trend === 'down' ? '-' : '+'}{Math.abs(progress.changeFailureRate.current - progress.changeFailureRate.previousPeriod).toFixed(1)}%
              </span>
            </div>
          </div>
          
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-700">
                Current: {progress.changeFailureRate.current}%
              </span>
              <span className="text-xs font-medium text-gray-700">
                Target: {progress.changeFailureRate.target}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${changeFailureRateBarColor}`} 
                style={{ width: `${changeFailureRatePercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Security & Compliance section with detailed metrics
  const renderSecurityCompliance = () => {
    // Add null checks to prevent errors when accessing properties
    if (!progress || !progress.complianceRate || !progress.vulnerabilityCount) {
      return (
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900">Security & Compliance</h3>
          <p className="text-sm text-gray-500">Loading metrics data...</p>
        </div>
      );
    }
    
    const complianceRatePercentage = calculatePercentage(
      progress.complianceRate.current, 
      progress.complianceRate.target
    );
    
    const vulnerabilityCountPercentage = calculateVulnerabilityCountPercentage(
      progress.vulnerabilityCount.current,
      progress.vulnerabilityCount.target
    );
    
    const complianceRateBarColor = getProgressBarColor(progress.complianceRate.status, complianceRatePercentage);
    const vulnerabilityCountBarColor = getProgressBarColor(progress.vulnerabilityCount.status, vulnerabilityCountPercentage);
    
    return (
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-900">Security & Compliance</h3>
          <div className="flex items-center">
            {getTrendIcon(progress.securityCompliance.trend)}
            <span className={`ml-1 text-sm ${getStatusColor(progress.securityCompliance.status)}`}>
              {progress.securityCompliance.trend === 'up' ? '+' : ''}{Math.abs(progress.securityCompliance.current - progress.securityCompliance.previousPeriod).toFixed(1)}
            </span>
          </div>
        </div>
        <p className="mt-1 text-sm text-gray-500">{progress.securityCompliance.description}</p>
        
        {/* Compliance Rate */}
        <div className="mt-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <Shield size={16} className="text-blue-700 mr-2" />
              <h4 className="text-sm font-medium text-gray-900">{progress.complianceRate.name}</h4>
            </div>
            <div className="flex items-center">
              {getTrendIcon(progress.complianceRate.trend)}
              <span className={`ml-1 text-xs ${getStatusColor(progress.complianceRate.status)}`}>
                {progress.complianceRate.trend === 'up' ? '+' : '-'}{Math.abs(progress.complianceRate.current - progress.complianceRate.previousPeriod).toFixed(1)}%
              </span>
            </div>
          </div>
          
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-700">
                Current: {progress.complianceRate.current}%
              </span>
              <span className="text-xs font-medium text-gray-700">
                Target: {progress.complianceRate.target}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${complianceRateBarColor}`} 
                style={{ width: `${complianceRatePercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Vulnerability Count */}
        <div className="mt-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <FileWarning size={16} className="text-blue-700 mr-2" />
              <h4 className="text-sm font-medium text-gray-900">{progress.vulnerabilityCount.name}</h4>
            </div>
            <div className="flex items-center">
              {getTrendIcon(progress.vulnerabilityCount.trend)}
              <span className={`ml-1 text-xs ${getStatusColor(progress.vulnerabilityCount.status)}`}>
                {progress.vulnerabilityCount.trend === 'down' ? '-' : '+'}{Math.abs(progress.vulnerabilityCount.current - progress.vulnerabilityCount.previousPeriod)}
              </span>
            </div>
          </div>
          
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-700">
                Current: {progress.vulnerabilityCount.current}
              </span>
              <span className="text-xs font-medium text-gray-700">
                Target: {progress.vulnerabilityCount.target}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${vulnerabilityCountBarColor}`} 
                style={{ width: `${vulnerabilityCountPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Technology Simplification section with four detailed metrics
  const renderTechSimplification = () => {
    // Add null checks to prevent errors when accessing properties
    if (!progress || !progress.goldenStatePercentage || !progress.architecturalIntegrityIndex || 
        !progress.deliveryProcessAutomated || !progress.selfServiceDeveloped) {
      return (
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900">Technology Simplification</h3>
          <p className="text-sm text-gray-500">Loading metrics data...</p>
        </div>
      );
    }
    
    const goldenStatePercentage = calculatePercentage(
      progress.goldenStatePercentage.current, 
      progress.goldenStatePercentage.target
    );
    
    const architecturalIntegrityPercentage = calculatePercentage(
      progress.architecturalIntegrityIndex.current,
      progress.architecturalIntegrityIndex.target
    );
    
    const deliveryProcessPercentage = calculatePercentage(
      progress.deliveryProcessAutomated.current,
      progress.deliveryProcessAutomated.target
    );
    
    const selfServicePercentage = calculatePercentage(
      progress.selfServiceDeveloped.current,
      progress.selfServiceDeveloped.target
    );
    
    const goldenStateBarColor = getProgressBarColor(progress.goldenStatePercentage.status, goldenStatePercentage);
    const architecturalIntegrityBarColor = getProgressBarColor(progress.architecturalIntegrityIndex.status, architecturalIntegrityPercentage);
    const deliveryProcessBarColor = getProgressBarColor(progress.deliveryProcessAutomated.status, deliveryProcessPercentage);
    const selfServiceBarColor = getProgressBarColor(progress.selfServiceDeveloped.status, selfServicePercentage);
    
    return (
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-900">Technology Simplification</h3>
          <div className="flex items-center">
            {getTrendIcon(progress.techSimplification.trend)}
            <span className={`ml-1 text-sm ${getStatusColor(progress.techSimplification.status)}`}>
              {progress.techSimplification.trend === 'up' ? '+' : ''}{Math.abs(progress.techSimplification.current - progress.techSimplification.previousPeriod).toFixed(1)}
            </span>
          </div>
        </div>
        <p className="mt-1 text-sm text-gray-500">{progress.techSimplification.description}</p>
        
        {/* Golden State Percentage */}
        <div className="mt-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <Layers size={16} className="text-blue-700 mr-2" />
              <h4 className="text-sm font-medium text-gray-900">{progress.goldenStatePercentage.name}</h4>
            </div>
            <div className="flex items-center">
              {getTrendIcon(progress.goldenStatePercentage.trend)}
              <span className={`ml-1 text-xs ${getStatusColor(progress.goldenStatePercentage.status)}`}>
                {progress.goldenStatePercentage.trend === 'up' ? '+' : '-'}{Math.abs(progress.goldenStatePercentage.current - progress.goldenStatePercentage.previousPeriod).toFixed(1)}%
              </span>
            </div>
          </div>
          
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-700">
                Current: {progress.goldenStatePercentage.current}%
              </span>
              <span className="text-xs font-medium text-gray-700">
                Target: {progress.goldenStatePercentage.target}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${goldenStateBarColor}`} 
                style={{ width: `${goldenStatePercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Architectural Integrity Index */}
        <div className="mt-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <Code size={16} className="text-blue-700 mr-2" />
              <h4 className="text-sm font-medium text-gray-900">{progress.architecturalIntegrityIndex.name}</h4>
            </div>
            <div className="flex items-center">
              {getTrendIcon(progress.architecturalIntegrityIndex.trend)}
              <span className={`ml-1 text-xs ${getStatusColor(progress.architecturalIntegrityIndex.status)}`}>
                {progress.architecturalIntegrityIndex.trend === 'up' ? '+' : '-'}{Math.abs(progress.architecturalIntegrityIndex.current - progress.architecturalIntegrityIndex.previousPeriod).toFixed(1)}
              </span>
            </div>
          </div>
          
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-700">
                Current: {progress.architecturalIntegrityIndex.current}
              </span>
              <span className="text-xs font-medium text-gray-700">
                Target: {progress.architecturalIntegrityIndex.target}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${architecturalIntegrityBarColor}`} 
                style={{ width: `${architecturalIntegrityPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Delivery Process Automated */}
        <div className="mt-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <GitBranch size={16} className="text-blue-700 mr-2" />
              <h4 className="text-sm font-medium text-gray-900">{progress.deliveryProcessAutomated.name}</h4>
            </div>
            <div className="flex items-center">
              {getTrendIcon(progress.deliveryProcessAutomated.trend)}
              <span className={`ml-1 text-xs ${getStatusColor(progress.deliveryProcessAutomated.status)}`}>
                {progress.deliveryProcessAutomated.trend === 'up' ? '+' : '-'}{Math.abs(progress.deliveryProcessAutomated.current - progress.deliveryProcessAutomated.previousPeriod).toFixed(1)}%
              </span>
            </div>
          </div>
          
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-700">
                Current: {progress.deliveryProcessAutomated.current}%
              </span>
              <span className="text-xs font-medium text-gray-700">
                Target: {progress.deliveryProcessAutomated.target}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${deliveryProcessBarColor}`} 
                style={{ width: `${deliveryProcessPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Self Service Developed */}
        <div className="mt-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <Server size={16} className="text-blue-700 mr-2" />
              <h4 className="text-sm font-medium text-gray-900">{progress.selfServiceDeveloped.name}</h4>
            </div>
            <div className="flex items-center">
              {getTrendIcon(progress.selfServiceDeveloped.trend)}
              <span className={`ml-1 text-xs ${getStatusColor(progress.selfServiceDeveloped.status)}`}>
                {progress.selfServiceDeveloped.trend === 'up' ? '+' : '-'}{Math.abs(progress.selfServiceDeveloped.current - progress.selfServiceDeveloped.previousPeriod).toFixed(1)}%
              </span>
            </div>
          </div>
          
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-700">
                Current: {progress.selfServiceDeveloped.current}%
              </span>
              <span className="text-xs font-medium text-gray-700">
                Target: {progress.selfServiceDeveloped.target}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${selfServiceBarColor}`} 
                style={{ width: `${selfServicePercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Cost Efficiency section with Cost-Driver Optimization
  const renderCostEfficiency = () => {
    // Add null checks to prevent errors when accessing properties
    if (!progress || !progress.costEfficiency || !progress.costDriverOptimization) {
      return (
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900">Cost Efficiency</h3>
          <p className="text-sm text-gray-500">Loading metrics data...</p>
        </div>
      );
    }
    
    const costDriverOptimizationPercentage = calculatePercentage(
      progress.costDriverOptimization.current, 
      progress.costDriverOptimization.target
    );
    
    const costDriverOptimizationBarColor = getProgressBarColor(
      progress.costDriverOptimization.status, 
      costDriverOptimizationPercentage
    );
    
    return (
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-900">Cost Efficiency</h3>
          <div className="flex items-center">
            {getTrendIcon(progress.costEfficiency.trend)}
            <span className={`ml-1 text-sm ${getStatusColor(progress.costEfficiency.status)}`}>
              {progress.costEfficiency.trend === 'up' ? '+' : ''}{Math.abs(progress.costEfficiency.current - progress.costEfficiency.previousPeriod).toFixed(1)}
            </span>
          </div>
        </div>
        <p className="mt-1 text-sm text-gray-500">{progress.costEfficiency.description}</p>
        
        {/* Cost-Driver Optimization */}
        <div className="mt-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <DollarSign size={16} className="text-blue-700 mr-2" />
              <h4 className="text-sm font-medium text-gray-900">{progress.costDriverOptimization.name}</h4>
            </div>
            <div className="flex items-center">
              {getTrendIcon(progress.costDriverOptimization.trend)}
              <span className={`ml-1 text-xs ${getStatusColor(progress.costDriverOptimization.status)}`}>
                {progress.costDriverOptimization.trend === 'up' ? '+' : '-'}{Math.abs(progress.costDriverOptimization.current - progress.costDriverOptimization.previousPeriod).toFixed(1)}%
              </span>
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">{progress.costDriverOptimization.description}</p>
          
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-700">
                Current: {progress.costDriverOptimization.current}%
              </span>
              <span className="text-xs font-medium text-gray-700">
                Target: {progress.costDriverOptimization.target}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${costDriverOptimizationBarColor}`} 
                style={{ width: `${costDriverOptimizationPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Technical Community section with six detailed metrics
  const renderTechnicalCommunity = () => {
    // Add null checks to prevent errors when accessing properties
    if (!progress || !progress.engineerSatisfactionScore || !progress.dsoHowWeShowUp || 
        !progress.dsoWhatWeFocusOn || !progress.dsoHowWeAreOrganized || 
        !progress.dsoHowWeCreateValue || !progress.dsoHowWeGetWorkDone) {
      return (
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900">Technical Community</h3>
          <p className="text-sm text-gray-500">Loading metrics data...</p>
        </div>
      );
    }
    
    // Calculate percentages for all metrics
    const engineerSatisfactionPercentage = calculatePercentage(
      progress.engineerSatisfactionScore.current, 
      progress.engineerSatisfactionScore.target
    );
    
    const howWeShowUpPercentage = calculatePercentage(
      progress.dsoHowWeShowUp.current,
      progress.dsoHowWeShowUp.target
    );
    
    const whatWeFocusOnPercentage = calculatePercentage(
      progress.dsoWhatWeFocusOn.current,
      progress.dsoWhatWeFocusOn.target
    );
    
    const howWeAreOrganizedPercentage = calculatePercentage(
      progress.dsoHowWeAreOrganized.current,
      progress.dsoHowWeAreOrganized.target
    );
    
    const howWeCreateValuePercentage = calculatePercentage(
      progress.dsoHowWeCreateValue.current,
      progress.dsoHowWeCreateValue.target
    );
    
    const howWeGetWorkDonePercentage = calculatePercentage(
      progress.dsoHowWeGetWorkDone.current,
      progress.dsoHowWeGetWorkDone.target
    );
    
    // Get progress bar colors
    const engineerSatisfactionBarColor = getProgressBarColor(progress.engineerSatisfactionScore.status, engineerSatisfactionPercentage);
    const howWeShowUpBarColor = getProgressBarColor(progress.dsoHowWeShowUp.status, howWeShowUpPercentage);
    const whatWeFocusOnBarColor = getProgressBarColor(progress.dsoWhatWeFocusOn.status, whatWeFocusOnPercentage);
    const howWeAreOrganizedBarColor = getProgressBarColor(progress.dsoHowWeAreOrganized.status, howWeAreOrganizedPercentage);
    const howWeCreateValueBarColor = getProgressBarColor(progress.dsoHowWeCreateValue.status, howWeCreateValuePercentage);
    const howWeGetWorkDoneBarColor = getProgressBarColor(progress.dsoHowWeGetWorkDone.status, howWeGetWorkDonePercentage);
    
    return (
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-900">Technical Community</h3>
          <div className="flex items-center">
            {getTrendIcon(progress.technicalCommunity.trend)}
            <span className={`ml-1 text-sm ${getStatusColor(progress.technicalCommunity.status)}`}>
              {progress.technicalCommunity.trend === 'up' ? '+' : ''}{Math.abs(progress.technicalCommunity.current - progress.technicalCommunity.previousPeriod).toFixed(1)}
            </span>
          </div>
        </div>
        <p className="mt-1 text-sm text-gray-500">{progress.technicalCommunity.description}</p>
        
        {/* Engineer Satisfaction Score */}
        <div className="mt-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <Heart size={16} className="text-blue-700 mr-2" />
              <h4 className="text-sm font-medium text-gray-900">{progress.engineerSatisfactionScore.name}</h4>
            </div>
            <div className="flex items-center">
              {getTrendIcon(progress.engineerSatisfactionScore.trend)}
              <span className={`ml-1 text-xs ${getStatusColor(progress.engineerSatisfactionScore.status)}`}>
                {progress.engineerSatisfactionScore.trend === 'up' ? '+' : '-'}{Math.abs(progress.engineerSatisfactionScore.current - progress.engineerSatisfactionScore.previousPeriod).toFixed(1)}%
              </span>
            </div>
          </div>
          
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-700">
                Current: {progress.engineerSatisfactionScore.current}%
              </span>
              <span className="text-xs font-medium text-gray-700">
                Target: {progress.engineerSatisfactionScore.target}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${engineerSatisfactionBarColor}`} 
                style={{ width: `${engineerSatisfactionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* DSO How we show up */}
        <div className="mt-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <Users size={16} className="text-blue-700 mr-2" />
              <h4 className="text-sm font-medium text-gray-900">{progress.dsoHowWeShowUp.name}</h4>
            </div>
            <div className="flex items-center">
              {getTrendIcon(progress.dsoHowWeShowUp.trend)}
              <span className={`ml-1 text-xs ${getStatusColor(progress.dsoHowWeShowUp.status)}`}>
                {progress.dsoHowWeShowUp.trend === 'up' ? '+' : '-'}{Math.abs(progress.dsoHowWeShowUp.current - progress.dsoHowWeShowUp.previousPeriod).toFixed(1)}%
              </span>
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">{progress.dsoHowWeShowUp.description}</p>
          
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-700">
                Current: {progress.dsoHowWeShowUp.current}%
              </span>
              <span className="text-xs font-medium text-gray-700">
                Target: {progress.dsoHowWeShowUp.target}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${howWeShowUpBarColor}`} 
                style={{ width: `${howWeShowUpPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* DSO What we focus on */}
        <div className="mt-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <Target size={16} className="text-blue-700 mr-2" />
              <h4 className="text-sm font-medium text-gray-900">{progress.dsoWhatWeFocusOn.name}</h4>
            </div>
            <div className="flex items-center">
              {getTrendIcon(progress.dsoWhatWeFocusOn.trend)}
              <span className={`ml-1 text-xs ${getStatusColor(progress.dsoWhatWeFocusOn.status)}`}>
                {progress.dsoWhatWeFocusOn.trend === 'up' ? '+' : '-'}{Math.abs(progress.dsoWhatWeFocusOn.current - progress.dsoWhatWeFocusOn.previousPeriod).toFixed(1)}%
              </span>
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">{progress.dsoWhatWeFocusOn.description}</p>
          
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-700">
                Current: {progress.dsoWhatWeFocusOn.current}%
              </span>
              <span className="text-xs font-medium text-gray-700">
                Target: {progress.dsoWhatWeFocusOn.target}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${whatWeFocusOnBarColor}`} 
                style={{ width: `${whatWeFocusOnPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* DSO How we are organized */}
        <div className="mt-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <Network size={16} className="text-blue-700 mr-2" />
              <h4 className="text-sm font-medium text-gray-900">{progress.dsoHowWeAreOrganized.name}</h4>
            </div>
            <div className="flex items-center">
              {getTrendIcon(progress.dsoHowWeAreOrganized.trend)}
              <span className={`ml-1 text-xs ${getStatusColor(progress.dsoHowWeAreOrganized.status)}`}>
                {progress.dsoHowWeAreOrganized.trend === 'up' ? '+' : '-'}{Math.abs(progress.dsoHowWeAreOrganized.current - progress.dsoHowWeAreOrganized.previousPeriod).toFixed(1)}%
              </span>
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">{progress.dsoHowWeAreOrganized.description}</p>
          
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-700">
                Current: {progress.dsoHowWeAreOrganized.current}%
              </span>
              <span className="text-xs font-medium text-gray-700">
                Target: {progress.dsoHowWeAreOrganized.target}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${howWeAreOrganizedBarColor}`} 
                style={{ width: `${howWeAreOrganizedPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* DSO How we create value */}
        <div className="mt-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <Gift size={16} className="text-blue-700 mr-2" />
              <h4 className="text-sm font-medium text-gray-900">{progress.dsoHowWeCreateValue.name}</h4>
            </div>
            <div className="flex items-center">
              {getTrendIcon(progress.dsoHowWeCreateValue.trend)}
              <span className={`ml-1 text-xs ${getStatusColor(progress.dsoHowWeCreateValue.status)}`}>
                {progress.dsoHowWeCreateValue.trend === 'up' ? '+' : '-'}{Math.abs(progress.dsoHowWeCreateValue.current - progress.dsoHowWeCreateValue.previousPeriod).toFixed(1)}%
              </span>
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">{progress.dsoHowWeCreateValue.description}</p>
          
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-700">
                Current: {progress.dsoHowWeCreateValue.current}%
              </span>
              <span className="text-xs font-medium text-gray-700">
                Target: {progress.dsoHowWeCreateValue.target}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${howWeCreateValueBarColor}`} 
                style={{ width: `${howWeCreateValuePercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* DSO How we get work done */}
        <div className="mt-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <Zap size={16} className="text-blue-700 mr-2" />
              <h4 className="text-sm font-medium text-gray-900">{progress.dsoHowWeGetWorkDone.name}</h4>
            </div>
            <div className="flex items-center">
              {getTrendIcon(progress.dsoHowWeGetWorkDone.trend)}
              <span className={`ml-1 text-xs ${getStatusColor(progress.dsoHowWeGetWorkDone.status)}`}>
                {progress.dsoHowWeGetWorkDone.trend === 'up' ? '+' : '-'}{Math.abs(progress.dsoHowWeGetWorkDone.current - progress.dsoHowWeGetWorkDone.previousPeriod).toFixed(1)}%
              </span>
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">{progress.dsoHowWeGetWorkDone.description}</p>
          
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-700">
                Current: {progress.dsoHowWeGetWorkDone.current}%
              </span>
              <span className="text-xs font-medium text-gray-700">
                Target: {progress.dsoHowWeGetWorkDone.target}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${howWeGetWorkDoneBarColor}`} 
                style={{ width: `${howWeGetWorkDonePercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Add null check for the entire progress object
  if (!progress) {
    return (
      <section id="progress-section" className="bg-white rounded-lg shadow mb-6">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Platform Operating Model</h2>
          <p className="mt-1 text-sm text-gray-500">Loading progress data...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="progress-section" className="bg-white rounded-lg shadow mb-6">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Platform Operating Model</h2>
        <p className="mt-1 text-sm text-gray-500">
          Tracking our progress to "Transform IT into an Innovation Engine for Bayer that drives new product breakthroughs and creates differentiating customer experiences"
        </p>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Time to Market Card - Takes up 1 full column */}
          <div className="lg:col-span-1">
            {renderDoraMetrics()}
          </div>
          
          {/* Quality & Reliability Card with DORA metrics */}
          <div className="lg:col-span-1">
            {renderQualityReliability()}
          </div>
          
          {/* Security & Compliance Card with detailed metrics */}
          <div className="lg:col-span-1">
            {renderSecurityCompliance()}
          </div>
          
          {/* Technology Simplification Card with four detailed metrics */}
          <div className="lg:col-span-1">
            {renderTechSimplification()}
          </div>
          
          {/* Cost Efficiency Card with Cost-Driver Optimization */}
          <div className="lg:col-span-1">
            {renderCostEfficiency()}
          </div>
          
          {/* Technical Community Card with six detailed metrics */}
          <div className="lg:col-span-1">
            {renderTechnicalCommunity()}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgressSection;
