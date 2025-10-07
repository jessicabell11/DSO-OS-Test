import { RelatedTeam } from '../types';

export const relatedTeamsData: RelatedTeam[] = [
  {
    id: 'team-1',
    name: 'Platform Engineering',
    description: 'Builds and maintains core platform infrastructure and services',
    logo: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=100',
    relationshipType: 'capability',
    relationshipStrength: 'high',
    sharedOutcomes: [
      'Improve system reliability',
      'Reduce deployment time',
      'Standardize development environments'
    ],
    capabilities: [
      'CI/CD Pipeline',
      'Infrastructure as Code',
      'Monitoring & Observability',
      'Service Mesh'
    ],
    capacity: 'medium',
    contactPerson: {
      name: 'Alex Chen',
      role: 'Platform Lead',
      avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=100',
      email: 'alex.chen@example.com'
    },
    lastCollaboration: '2023-06-15',
    upcomingMilestones: [
      'Kubernetes v1.26 upgrade (Oct 15)',
      'New observability stack rollout (Nov 10)',
      'Developer portal launch (Dec 5)'
    ]
  },
  {
    id: 'team-2',
    name: 'User Research',
    description: 'Conducts research to understand user needs and behaviors',
    logo: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=100',
    relationshipType: 'outcome',
    relationshipStrength: 'high',
    sharedOutcomes: [
      'Improve user satisfaction',
      'Increase feature adoption',
      'Reduce user-reported issues'
    ],
    capabilities: [
      'User Interviews',
      'Usability Testing',
      'Survey Design',
      'Analytics Interpretation'
    ],
    capacity: 'high',
    contactPerson: {
      name: 'Maya Johnson',
      role: 'Research Director',
      avatar: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=100',
      email: 'maya.johnson@example.com'
    },
    lastCollaboration: '2023-08-22',
    upcomingMilestones: [
      'Q4 User Research Plan (Oct 1)',
      'Annual User Survey (Nov 15)',
      'Research Repository Launch (Dec 10)'
    ]
  },
  {
    id: 'team-3',
    name: 'Data Science',
    description: 'Develops ML models and data-driven insights',
    logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100',
    relationshipType: 'backlog',
    relationshipStrength: 'medium',
    sharedOutcomes: [
      'Improve recommendation accuracy',
      'Reduce manual data processing',
      'Enable data-driven decisions'
    ],
    capabilities: [
      'Machine Learning',
      'Data Visualization',
      'Predictive Analytics',
      'A/B Testing'
    ],
    capacity: 'low',
    contactPerson: {
      name: 'David Park',
      role: 'Lead Data Scientist',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
      email: 'david.park@example.com'
    },
    lastCollaboration: '2023-04-10',
    upcomingMilestones: [
      'Recommendation Engine v2 (Oct 30)',
      'Data Pipeline Upgrade (Nov 20)',
      'Annual Data Strategy Planning (Dec 15)'
    ]
  },
  {
    id: 'team-4',
    name: 'Design Systems',
    description: 'Creates and maintains shared design components and patterns',
    logo: 'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=100',
    relationshipType: 'capability',
    relationshipStrength: 'medium',
    sharedOutcomes: [
      'Improve design consistency',
      'Accelerate UI development',
      'Enhance accessibility compliance'
    ],
    capabilities: [
      'Component Library',
      'Design Tokens',
      'Accessibility Testing',
      'Design Documentation'
    ],
    capacity: 'medium',
    contactPerson: {
      name: 'Sofia Rodriguez',
      role: 'Design Systems Lead',
      avatar: 'https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg?auto=compress&cs=tinysrgb&w=100',
      email: 'sofia.rodriguez@example.com'
    },
    lastCollaboration: '2023-07-05',
    upcomingMilestones: [
      'Component Library v3 (Oct 10)',
      'Accessibility Audit (Nov 5)',
      'Design System Documentation Refresh (Dec 1)'
    ]
  },
  {
    id: 'team-5',
    name: 'Security Engineering',
    description: 'Ensures application and infrastructure security',
    logo: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=100',
    relationshipType: 'multiple',
    relationshipStrength: 'high',
    sharedOutcomes: [
      'Reduce security vulnerabilities',
      'Improve compliance posture',
      'Enhance data protection'
    ],
    capabilities: [
      'Security Testing',
      'Compliance Automation',
      'Identity Management',
      'Threat Modeling'
    ],
    capacity: 'low',
    contactPerson: {
      name: 'Omar Hassan',
      role: 'Security Lead',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
      email: 'omar.hassan@example.com'
    },
    lastCollaboration: '2023-09-01',
    upcomingMilestones: [
      'Annual Security Audit (Oct 20)',
      'Zero Trust Implementation (Nov 30)',
      'Security Training Refresh (Dec 15)'
    ]
  },
  {
    id: 'team-6',
    name: 'Customer Success',
    description: 'Ensures customers achieve their desired outcomes',
    logo: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=100',
    relationshipType: 'outcome',
    relationshipStrength: 'medium',
    sharedOutcomes: [
      'Improve customer retention',
      'Increase feature adoption',
      'Reduce time to value'
    ],
    capabilities: [
      'Customer Onboarding',
      'Usage Analytics',
      'Training Materials',
      'Success Metrics'
    ],
    capacity: 'high',
    contactPerson: {
      name: 'Priya Sharma',
      role: 'Customer Success Manager',
      avatar: 'https://images.pexels.com/photos/3771807/pexels-photo-3771807.jpeg?auto=compress&cs=tinysrgb&w=100',
      email: 'priya.sharma@example.com'
    },
    lastCollaboration: '2023-05-18',
    upcomingMilestones: [
      'Customer Health Score Dashboard (Oct 5)',
      'Onboarding Process Redesign (Nov 15)',
      'Annual Customer Success Planning (Dec 10)'
    ]
  },
  {
    id: 'team-7',
    name: 'API Platform',
    description: 'Builds and maintains API infrastructure and standards',
    logo: 'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=100',
    relationshipType: 'capability',
    relationshipStrength: 'high',
    sharedOutcomes: [
      'Improve API performance',
      'Standardize API design',
      'Enable third-party integrations'
    ],
    capabilities: [
      'API Gateway',
      'OpenAPI Documentation',
      'Rate Limiting',
      'API Analytics'
    ],
    capacity: 'medium',
    contactPerson: {
      name: 'James Wilson',
      role: 'API Platform Lead',
      avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=100',
      email: 'james.wilson@example.com'
    },
    lastCollaboration: '2023-08-10',
    upcomingMilestones: [
      'API Gateway v2 Launch (Oct 25)',
      'Developer Portal Enhancements (Nov 10)',
      'API Standards Update (Dec 5)'
    ]
  },
  {
    id: 'team-8',
    name: 'Quality Engineering',
    description: 'Ensures product quality through testing and automation',
    logo: 'https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=100',
    relationshipType: 'backlog',
    relationshipStrength: 'medium',
    sharedOutcomes: [
      'Reduce production defects',
      'Improve test coverage',
      'Accelerate release cycles'
    ],
    capabilities: [
      'Automated Testing',
      'Performance Testing',
      'Test Data Management',
      'Quality Metrics'
    ],
    capacity: 'high',
    contactPerson: {
      name: 'Lin Wei',
      role: 'QE Manager',
      avatar: 'https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg?auto=compress&cs=tinysrgb&w=100',
      email: 'lin.wei@example.com'
    },
    lastCollaboration: '2023-07-22',
    upcomingMilestones: [
      'Test Automation Framework Upgrade (Oct 15)',
      'Performance Testing Suite Launch (Nov 20)',
      'Quality Metrics Dashboard (Dec 10)'
    ]
  }
];
