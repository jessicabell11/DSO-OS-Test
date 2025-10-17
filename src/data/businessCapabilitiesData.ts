import { BusinessCapability } from '../types';

// Core capabilities based on the Bayer Capability Map
export const coreCapabilities: BusinessCapability[] = [
  // Develop domain
  {
    id: 'develop-innovation-management',
    name: 'Innovation Management',
    category: 'core',
    domain: 'Develop',
    description: 'Managing the innovation process from ideation to implementation'
  },
  {
    id: 'develop-product-development',
    name: 'Product Development',
    category: 'core',
    domain: 'Develop',
    description: 'Creating and evolving products from concept to market-ready solutions'
  },
  {
    id: 'develop-research',
    name: 'Research',
    category: 'core',
    domain: 'Develop',
    description: 'Scientific research activities to discover new knowledge and applications'
  },
  
  // Plan domain
  {
    id: 'plan-strategic-planning',
    name: 'Strategic Planning',
    category: 'core',
    domain: 'Plan',
    description: 'Long-term planning and strategy development for the organization'
  },
  {
    id: 'plan-portfolio-management',
    name: 'Portfolio Management',
    category: 'core',
    domain: 'Plan',
    description: 'Managing the portfolio of products, projects, and investments'
  },
  {
    id: 'plan-resource-planning',
    name: 'Resource Planning',
    category: 'core',
    domain: 'Plan',
    description: 'Planning and allocation of resources across the organization'
  },
  
  // Procure domain
  {
    id: 'procure-supplier-management',
    name: 'Supplier Management',
    category: 'core',
    domain: 'Procure',
    description: 'Managing relationships with suppliers and vendors'
  },
  {
    id: 'procure-procurement',
    name: 'Procurement',
    category: 'core',
    domain: 'Procure',
    description: 'Acquiring goods and services for the organization'
  },
  {
    id: 'procure-contract-management',
    name: 'Contract Management',
    category: 'core',
    domain: 'Procure',
    description: 'Managing contracts with suppliers, partners, and customers'
  },
  
  // Produce domain
  {
    id: 'produce-manufacturing',
    name: 'Manufacturing',
    category: 'core',
    domain: 'Produce',
    description: 'Production of goods and products'
  },
  {
    id: 'produce-quality-management',
    name: 'Quality Management',
    category: 'core',
    domain: 'Produce',
    description: 'Ensuring quality standards in products and processes'
  },
  {
    id: 'produce-supply-chain',
    name: 'Supply Chain Management',
    category: 'core',
    domain: 'Produce',
    description: 'Managing the flow of goods and services from suppliers to customers'
  },
  
  // Market domain
  {
    id: 'market-brand-management',
    name: 'Brand Management',
    category: 'core',
    domain: 'Market',
    description: 'Managing brand identity, positioning, and perception'
  },
  {
    id: 'market-marketing-strategy',
    name: 'Marketing Strategy',
    category: 'core',
    domain: 'Market',
    description: 'Developing and executing marketing strategies'
  },
  {
    id: 'market-market-research',
    name: 'Market Research',
    category: 'core',
    domain: 'Market',
    description: 'Gathering and analyzing market data and customer insights'
  },
  
  // Sell domain
  {
    id: 'sell-sales-management',
    name: 'Sales Management',
    category: 'core',
    domain: 'Sell',
    description: 'Managing sales activities, teams, and processes'
  },
  {
    id: 'sell-account-management',
    name: 'Account Management',
    category: 'core',
    domain: 'Sell',
    description: 'Managing relationships with key customers and accounts'
  },
  {
    id: 'sell-pricing-strategy',
    name: 'Pricing Strategy',
    category: 'core',
    domain: 'Sell',
    description: 'Developing and implementing pricing strategies'
  },
  
  // Deliver domain
  {
    id: 'deliver-customer-service',
    name: 'Customer Service',
    category: 'core',
    domain: 'Deliver',
    description: 'Providing support and service to customers'
  },
  {
    id: 'deliver-order-management',
    name: 'Order Management',
    category: 'core',
    domain: 'Deliver',
    description: 'Processing and fulfilling customer orders'
  },
  {
    id: 'deliver-logistics',
    name: 'Logistics',
    category: 'core',
    domain: 'Deliver',
    description: 'Managing the transportation and delivery of products'
  },
  
  // Support domain
  {
    id: 'support-it-management',
    name: 'IT Management',
    category: 'core',
    domain: 'Support',
    description: 'Managing information technology resources and services'
  },
  {
    id: 'support-hr-management',
    name: 'HR Management',
    category: 'core',
    domain: 'Support',
    description: 'Managing human resources and personnel'
  },
  {
    id: 'support-finance-management',
    name: 'Finance Management',
    category: 'core',
    domain: 'Support',
    description: 'Managing financial resources and processes'
  }
];

// Enabling capabilities based on the Bayer Capability Map
export const enablingCapabilities: BusinessCapability[] = [
  // Human Management
  {
    id: 'enabling-talent-acquisition',
    name: 'Talent Acquisition',
    category: 'enabling',
    domain: 'Human Management',
    description: 'Recruiting and hiring talent for the organization'
  },
  {
    id: 'enabling-talent-development',
    name: 'Talent Development',
    category: 'enabling',
    domain: 'Human Management',
    description: 'Developing and training employees'
  },
  
  // Business Excellence
  {
    id: 'enabling-process-optimization',
    name: 'Process Optimization',
    category: 'enabling',
    domain: 'Business Excellence',
    description: 'Improving business processes for efficiency and effectiveness'
  },
  {
    id: 'enabling-change-management',
    name: 'Change Management',
    category: 'enabling',
    domain: 'Business Excellence',
    description: 'Managing organizational change initiatives'
  },
  
  // Data & Analytics
  {
    id: 'enabling-data-management',
    name: 'Data Management',
    category: 'enabling',
    domain: 'Data & Analytics',
    description: 'Managing data assets and infrastructure'
  },
  {
    id: 'enabling-analytics',
    name: 'Analytics',
    category: 'enabling',
    domain: 'Data & Analytics',
    description: 'Analyzing data to generate insights and support decision-making'
  },
  
  // Digital & Technology
  {
    id: 'enabling-digital-transformation',
    name: 'Digital Transformation',
    category: 'enabling',
    domain: 'Digital & Technology',
    description: 'Transforming business processes and models through digital technologies'
  },
  {
    id: 'enabling-technology-innovation',
    name: 'Technology Innovation',
    category: 'enabling',
    domain: 'Digital & Technology',
    description: 'Exploring and implementing new technologies'
  },
  
  // Health, Safety & Environment
  {
    id: 'enabling-health-safety',
    name: 'Health & Safety',
    category: 'enabling',
    domain: 'Health, Safety & Environment',
    description: 'Ensuring workplace health and safety'
  },
  {
    id: 'enabling-environmental-management',
    name: 'Environmental Management',
    category: 'enabling',
    domain: 'Health, Safety & Environment',
    description: 'Managing environmental impact and sustainability'
  },
  
  // Legal & Compliance
  {
    id: 'enabling-legal-services',
    name: 'Legal Services',
    category: 'enabling',
    domain: 'Legal & Compliance',
    description: 'Providing legal advice and services'
  },
  {
    id: 'enabling-compliance-management',
    name: 'Compliance Management',
    category: 'enabling',
    domain: 'Legal & Compliance',
    description: 'Ensuring compliance with laws, regulations, and policies'
  },
  
  // Finance & Controlling
  {
    id: 'enabling-financial-planning',
    name: 'Financial Planning',
    category: 'enabling',
    domain: 'Finance & Controlling',
    description: 'Planning and forecasting financial performance'
  },
  {
    id: 'enabling-controlling',
    name: 'Controlling',
    category: 'enabling',
    domain: 'Finance & Controlling',
    description: 'Monitoring and controlling financial performance'
  }
];

// All capabilities combined
export const allBusinessCapabilities = [...coreCapabilities, ...enablingCapabilities];

// Get capabilities by domain
export const getCapabilitiesByDomain = (domain: string) => {
  return allBusinessCapabilities.filter(capability => capability.domain === domain);
};

// Get unique domains
export const getUniqueDomains = (category: 'core' | 'enabling' | 'all' = 'all') => {
  let capabilities = allBusinessCapabilities;
  
  if (category !== 'all') {
    capabilities = allBusinessCapabilities.filter(capability => capability.category === category);
  }
  
  return [...new Set(capabilities.map(capability => capability.domain))];
};
