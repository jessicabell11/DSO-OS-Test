import { TeamWorkingAgreement } from '../types';

export const defaultWorkingAgreement: TeamWorkingAgreement = {
  id: '1',
  title: 'Team Working Agreement',
  description: 'This document outlines how our team works together, our shared values, and our processes.',
  sections: [
    {
      id: 'section-1',
      title: 'Communication',
      content: 'We use Slack for daily communication and Microsoft Teams for video calls. We have a daily standup at 10:00 AM. Important decisions are documented in Confluence.'
    },
    {
      id: 'section-2',
      title: 'Working Hours',
      content: 'Core hours are 10:00 AM - 3:00 PM. Team members are expected to be available during these hours for collaboration. Outside of core hours, team members can work flexibly.'
    },
    {
      id: 'section-3',
      title: 'Development Practices',
      content: 'We follow trunk-based development. Pull requests require at least one approval. We use automated testing and CI/CD pipelines. Code quality is maintained through regular refactoring and code reviews.'
    },
    {
      id: 'section-4',
      title: 'Meetings',
      content: 'All meetings must have an agenda. We respect start and end times. Action items are documented and assigned. We have a no-laptop policy for focused discussions.'
    }
  ],
  status: 'draft',
  version: 1.0,
  lastUpdated: new Date().toISOString(),
  approvals: [
    {
      memberId: 'Alex Johnson',
      approved: true,
      approvedAt: new Date().toISOString()
    },
    {
      memberId: 'Sophia Chen',
      approved: false
    },
    {
      memberId: 'Marcus Williams',
      approved: false
    },
    {
      memberId: 'Priya Patel',
      approved: true,
      approvedAt: new Date().toISOString()
    }
  ],
  teamInfoLinks: [
    {
      id: 'link-1',
      title: 'Team SharePoint',
      url: 'https://bayergroup.sharepoint.com/sites/Accelerator821/SitePages/Accelerator.aspx',
      type: 'sharepoint',
      description: 'Our team SharePoint site with documentation and resources'
    },
    {
      id: 'link-2',
      title: 'Engineering Wiki',
      url: 'https://contoso.wiki.com/Engineering',
      type: 'wiki',
      description: 'Engineering best practices and guidelines'
    }
  ],
  businessCapabilities: [
    'develop-product-development',
    'develop-innovation-management',
    'enabling-digital-transformation',
    'enabling-technology-innovation'
  ]
};
