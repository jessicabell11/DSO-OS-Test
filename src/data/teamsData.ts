import { Team } from '../types';

export const teamsData: Team[] = [
  {
    id: 'team-001',
    name: 'Accelerator Team',
    description: 'Driving innovation and accelerating digital transformation across the organization',
    logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=300',
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2023-06-22T14:30:00Z',
    status: 'active',
    members: ['1', '2', '3', '4', '5', '6', '7', '8'],
    businessCapabilities: [
      'develop-product-development',
      'develop-innovation-management',
      'enabling-digital-transformation',
      'enabling-technology-innovation'
    ],
    platform: 'Engineering Enablement Platform',
    workingAgreementId: '1',
    metrics: {
      cycleTime: 14.3,
      deploymentFrequency: 8.5,
      leadTime: 3.2,
      mttr: 1.5,
      defectRate: 2.1,
      teamHealth: 85
    }
  },
  {
    id: 'team-002',
    name: 'Digital Platform Team',
    description: 'Building and maintaining the core digital platform and infrastructure',
    logo: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=300',
    createdAt: '2023-02-10T09:15:00Z',
    updatedAt: '2023-06-18T11:45:00Z',
    status: 'active',
    members: ['1', '4', '5'],
    businessCapabilities: [
      'support-it-management',
      'enabling-technology-innovation',
      'enabling-data-management'
    ],
    platform: 'Infrastructure Platform',
    metrics: {
      cycleTime: 10.7,
      deploymentFrequency: 12.3,
      leadTime: 2.8,
      mttr: 0.8,
      defectRate: 1.5,
      teamHealth: 92
    }
  },
  {
    id: 'team-003',
    name: 'Customer Experience Team',
    description: 'Enhancing customer experience across all digital touchpoints',
    logo: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=300',
    createdAt: '2023-03-05T10:30:00Z',
    updatedAt: '2023-06-20T16:20:00Z',
    status: 'active',
    members: ['2', '3', '6', '8'],
    businessCapabilities: [
      'market-brand-management',
      'deliver-customer-service',
      'market-marketing-strategy'
    ],
    platform: 'CH Consumer & Customer Experience Platform',
    metrics: {
      cycleTime: 18.2,
      deploymentFrequency: 5.1,
      leadTime: 4.5,
      mttr: 2.3,
      defectRate: 3.2,
      teamHealth: 78
    }
  },
  {
    id: 'team-004',
    name: 'Data Analytics Team',
    description: 'Providing data-driven insights and analytics solutions',
    logo: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=300',
    createdAt: '2023-01-20T11:45:00Z',
    updatedAt: '2023-06-15T09:10:00Z',
    status: 'active',
    members: ['2', '7'],
    businessCapabilities: [
      'enabling-data-management',
      'enabling-analytics',
      'market-market-research'
    ],
    platform: 'Enterprise Data & Analytics Platform',
    metrics: {
      cycleTime: 12.5,
      deploymentFrequency: 3.8,
      leadTime: 5.2,
      mttr: 1.1,
      defectRate: 1.8,
      teamHealth: 88
    }
  },
  {
    id: 'team-005',
    name: 'Product Innovation Team',
    description: 'Researching and developing new product concepts and innovations',
    logo: 'https://images.pexels.com/photos/3153198/pexels-photo-3153198.jpeg?auto=compress&cs=tinysrgb&w=300',
    createdAt: '2023-04-12T14:20:00Z',
    updatedAt: '2023-06-10T13:40:00Z',
    status: 'active',
    members: ['1', '3', '6'],
    businessCapabilities: [
      'develop-innovation-management',
      'develop-product-development',
      'develop-research'
    ],
    platform: 'PH Drug Innovation Platform',
    metrics: {
      cycleTime: 22.7,
      deploymentFrequency: 2.1,
      leadTime: 8.5,
      mttr: 3.2,
      defectRate: 4.5,
      teamHealth: 82
    }
  },
  {
    id: 'team-006',
    name: 'Supply Chain Optimization',
    description: 'Optimizing supply chain processes and logistics',
    logo: 'https://images.pexels.com/photos/1427541/pexels-photo-1427541.jpeg?auto=compress&cs=tinysrgb&w=300',
    createdAt: '2023-02-28T09:00:00Z',
    updatedAt: '2023-05-25T15:30:00Z',
    status: 'inactive',
    members: ['4', '5', '7'],
    businessCapabilities: [
      'procure-supplier-management',
      'produce-supply-chain',
      'deliver-logistics'
    ],
    platform: 'Integrated Planning & Logistics Platform',
    metrics: {
      cycleTime: 16.8,
      deploymentFrequency: 1.5,
      leadTime: 7.2,
      mttr: 2.8,
      defectRate: 3.7,
      teamHealth: 75
    }
  },
  {
    id: 'team-007',
    name: 'Digital Marketing Team',
    description: 'Driving digital marketing strategies and campaigns',
    logo: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=300',
    createdAt: '2023-03-15T13:10:00Z',
    updatedAt: '2023-06-05T10:20:00Z',
    status: 'active',
    members: ['3', '6', '8'],
    businessCapabilities: [
      'market-marketing-strategy',
      'market-brand-management',
      'sell-pricing-strategy'
    ],
    platform: 'CH Consumer & Customer Experience Platform',
    metrics: {
      cycleTime: 9.5,
      deploymentFrequency: 6.8,
      leadTime: 2.5,
      mttr: 1.2,
      defectRate: 2.3,
      teamHealth: 90
    }
  }
];
