import React from 'react';
import { Users, TrendingUp, Zap, MessageSquare, Lightbulb } from 'lucide-react';
import { ProductAdoptionData, BacklogItem } from '../types';

interface ProductAdoptionSectionProps {
  productAdoption: ProductAdoptionData;
  addToBacklog: (recommendation: any) => void;
}

const ProductAdoptionSection: React.FC<ProductAdoptionSectionProps> = ({ productAdoption, addToBacklog }) => {
  const getMetricTrendIcon = (trend: string) => {
    if (trend === 'up') return <span className="text-green-500">↑</span>;
    if (trend === 'down') return <span className="text-red-500">↓</span>;
    return <span className="text-gray-500">→</span>;
  };

  const getFeatureUsageColor = (status: string) => {
    if (status === 'high') return 'bg-green-100 text-green-800';
    if (status === 'medium') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getSentimentColor = (sentiment: string) => {
    if (sentiment === 'positive') return 'text-green-500';
    if (sentiment === 'negative') return 'text-red-500';
    return 'text-gray-500';
  };

  const getImpactEffortColor = (level: string) => {
    if (level === 'high') return 'bg-blue-100 text-blue-800';
    if (level === 'medium') return 'bg-indigo-100 text-indigo-800';
    return 'bg-purple-100 text-purple-800';
  };

  const handleAddToBacklog = (recommendation: any) => {
    addToBacklog(recommendation);
  };

  return (
    <section id="product-adoption-section" className="bg-white rounded-lg shadow mb-6">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 flex items-center">
          <Users className="h-5 w-5 mr-2 text-blue-500" />
          Product Adoption & User Insights
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Understanding how users are adopting and using our product
        </p>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Key Metrics */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-blue-500" />
              Key Adoption Metrics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {productAdoption.metrics.map((metric, index) => (
                <div key={index} className="bg-white p-3 rounded-md shadow-sm">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-medium text-gray-700">{metric.name}</h4>
                    <span className="text-xs font-medium text-gray-500">
                      {getMetricTrendIcon(metric.trend)} {metric.changePercentage}
                    </span>
                  </div>
                  <div className="mt-2 flex items-end">
                    <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                    <span className="ml-1 text-xs text-gray-500">{metric.unit}</span>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(metric.value / metric.target) * 100}%` }}
                      ></div>
                    </div>
                    <div className="mt-1 text-xs text-gray-500 text-right">
                      Target: {metric.target} {metric.unit}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature Usage */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <Zap className="h-4 w-4 mr-2 text-blue-500" />
              Feature Usage
            </h3>
            <div className="space-y-3">
              {productAdoption.featureUsage.map((feature, index) => (
                <div key={index} className="bg-white p-3 rounded-md shadow-sm">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium text-gray-700">{feature.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${getFeatureUsageColor(feature.status)}`}>
                      {feature.usagePercentage}% usage
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{feature.description}</p>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          feature.status === 'high' ? 'bg-green-500' : 
                          feature.status === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${feature.usagePercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Research Insights */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <MessageSquare className="h-4 w-4 mr-2 text-blue-500" />
              User Research Insights
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {productAdoption.userResearch.map((insight, index) => (
                <div key={index} className="bg-white p-3 rounded-md shadow-sm">
                  <div className="flex items-start">
                    <div className={`mt-0.5 mr-2 ${getSentimentColor(insight.sentiment)}`}>
                      {insight.sentiment === 'positive' ? '😊' : 
                       insight.sentiment === 'negative' ? '😕' : '😐'}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">{insight.title}</h4>
                      <p className="mt-1 text-xs text-gray-600">{insight.description}</p>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-xs text-gray-500">{insight.source}</span>
                        <span className="text-xs text-gray-500">{insight.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <Lightbulb className="h-4 w-4 mr-2 text-blue-500" />
              Recommendations
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {productAdoption.recommendations.map((recommendation, index) => (
                <div key={index} className="bg-white p-3 rounded-md shadow-sm">
                  <h4 className="text-sm font-medium text-gray-700">{recommendation.title}</h4>
                  <p className="mt-1 text-xs text-gray-600">{recommendation.description}</p>
                  <div className="mt-3 flex justify-between items-center">
                    <div className="flex space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getImpactEffortColor(recommendation.impact)}`}>
                        Impact: {recommendation.impact}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getImpactEffortColor(recommendation.effort)}`}>
                        Effort: {recommendation.effort}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">{recommendation.timeframe}</span>
                  </div>
                  <div className="mt-3">
                    <button
                      onClick={() => handleAddToBacklog(recommendation)}
                      className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-1 px-3 rounded-md transition-colors flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add to Backlog
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductAdoptionSection;
