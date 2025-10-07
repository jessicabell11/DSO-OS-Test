import { TeamMember } from '../types';

export const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    role: 'Engineering Lead',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300',
    email: 'alex.johnson@devlake.org',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    department: 'Engineering',
    skills: ['Architecture', 'Go', 'Kubernetes', 'System Design', 'Team Leadership'],
    availability: 'available',
    bio: 'Engineering lead with 10+ years of experience in building data platforms and distributed systems. Leading the DevLake core platform development.',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/alexjohnson',
      github: 'https://github.com/alexj-devlake',
      twitter: 'https://twitter.com/alexj_tech'
    },
    projects: ['Core Platform', 'Data Pipeline', 'API Gateway']
  },
  {
    id: '2',
    name: 'Sophia Chen',
    role: 'Data Scientist',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300',
    email: 'sophia.chen@devlake.org',
    phone: '+1 (555) 234-5678',
    location: 'Boston, MA',
    department: 'Data Science',
    skills: ['Machine Learning', 'Python', 'Statistical Analysis', 'Data Visualization', 'NLP'],
    availability: 'busy',
    bio: 'Data scientist specializing in engineering metrics and performance analysis. Working on predictive models for development efficiency.',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/sophiachen',
      github: 'https://github.com/sophiac-devlake'
    },
    projects: ['Predictive Analytics', 'Anomaly Detection', 'Metrics Framework']
  },
  {
    id: '3',
    name: 'Marcus Williams',
    role: 'Frontend Developer',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=300',
    email: 'marcus.williams@devlake.org',
    phone: '+1 (555) 345-6789',
    location: 'Austin, TX',
    department: 'Engineering',
    skills: ['React', 'TypeScript', 'D3.js', 'UI/UX', 'Responsive Design'],
    availability: 'available',
    bio: 'Frontend specialist focused on creating intuitive data visualizations and dashboards for engineering metrics.',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/marcuswilliams',
      github: 'https://github.com/marcusw-devlake',
      twitter: 'https://twitter.com/marcusw_dev'
    },
    projects: ['Dashboard UI', 'Visualization Library', 'Design System']
  },
  {
    id: '4',
    name: 'Priya Patel',
    role: 'Backend Developer',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300',
    email: 'priya.patel@devlake.org',
    phone: '+1 (555) 456-7890',
    location: 'Seattle, WA',
    department: 'Engineering',
    skills: ['Go', 'PostgreSQL', 'API Design', 'Microservices', 'Performance Optimization'],
    availability: 'away',
    bio: 'Backend engineer specializing in data connectors and API integrations for various development tools.',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/priyapatel',
      github: 'https://github.com/priyap-devlake'
    },
    projects: ['Data Connectors', 'API Services', 'ETL Pipeline']
  },
  {
    id: '5',
    name: 'David Kim',
    role: 'DevOps Engineer',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300',
    email: 'david.kim@devlake.org',
    phone: '+1 (555) 567-8901',
    location: 'Chicago, IL',
    department: 'Operations',
    skills: ['Kubernetes', 'Docker', 'CI/CD', 'Terraform', 'Cloud Infrastructure'],
    availability: 'available',
    bio: 'DevOps specialist managing the infrastructure and deployment pipelines for DevLake and related services.',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/davidkim',
      github: 'https://github.com/davidk-devlake'
    },
    projects: ['Infrastructure', 'CI/CD Pipeline', 'Monitoring']
  },
  {
    id: '6',
    name: 'Elena Rodriguez',
    role: 'Product Manager',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=300',
    email: 'elena.rodriguez@devlake.org',
    phone: '+1 (555) 678-9012',
    location: 'New York, NY',
    department: 'Product',
    skills: ['Product Strategy', 'User Research', 'Roadmapping', 'Agile', 'Data Analytics'],
    availability: 'busy',
    bio: 'Product manager guiding the vision and roadmap for DevLake, with a focus on engineering metrics and insights.',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/elenarodriguez',
      twitter: 'https://twitter.com/elenar_product'
    },
    projects: ['Product Strategy', 'User Experience', 'Market Research']
  },
  {
    id: '7',
    name: 'James Wilson',
    role: 'QA Engineer',
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=300',
    email: 'james.wilson@devlake.org',
    phone: '+1 (555) 789-0123',
    location: 'Denver, CO',
    department: 'Engineering',
    skills: ['Test Automation', 'Python', 'Selenium', 'API Testing', 'Performance Testing'],
    availability: 'offline',
    bio: 'Quality assurance engineer ensuring the reliability and performance of DevLake through comprehensive testing.',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/jameswilson',
      github: 'https://github.com/jamesw-devlake'
    },
    projects: ['Test Automation', 'Quality Assurance', 'Performance Testing']
  },
  {
    id: '8',
    name: 'Aisha Mohammed',
    role: 'Community Manager',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300',
    email: 'aisha.mohammed@devlake.org',
    phone: '+1 (555) 890-1234',
    location: 'Portland, OR',
    department: 'Community',
    skills: ['Community Building', 'Technical Writing', 'Event Management', 'Open Source', 'Developer Relations'],
    availability: 'available',
    bio: 'Community manager fostering the DevLake open source community and helping users get the most from the platform.',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/aishamohammed',
      github: 'https://github.com/aisham-devlake',
      twitter: 'https://twitter.com/aisham_community'
    },
    projects: ['Community Engagement', 'Documentation', 'Events']
  }
];
