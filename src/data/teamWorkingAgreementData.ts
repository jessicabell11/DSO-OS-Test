import { TeamWorkingAgreement } from '../types';

export const defaultWorkingAgreement: TeamWorkingAgreement = {
  id: '1',
  title: 'Team Working Agreement',
  description: 'This document outlines how our team works together, our shared values, and our processes.',
  sections: [
    {
      id: 'section-1',
      title: 'Communication',
      content: 'We use Slack for day-to-day communication. Important decisions are documented in Confluence. We have daily standups at 10:00 AM.\n\nWe respect each other\'s focus time and try to batch non-urgent questions.'
    },
    {
      id: 'section-2',
      title: 'Meetings',
      content: 'We keep meetings focused and on-topic. All meetings have an agenda shared beforehand.\n\nWe start and end on time. If a meeting is no longer providing value, we\'re not afraid to end early.'
    },
    {
      id: 'section-3',
      title: 'Development Process',
      content: 'We follow trunk-based development. PRs should be small and focused.\n\nCode reviews are done within 24 hours. At least one approval is required before merging.\n\nWe write tests for all new features and bug fixes.'
    },
    {
      id: 'section-4',
      title: 'On-Call Responsibilities',
      content: 'We rotate on-call duties weekly. Handoffs happen every Monday at 10:00 AM.\n\nThe on-call person is responsible for triaging production issues and escalating when necessary.'
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
  backlogLink: {
    url: '',
    type: 'digital-product-journey'
  }
};
