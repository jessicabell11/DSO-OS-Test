import { TeamWorkingAgreement } from '../types';

export const defaultWorkingAgreement: TeamWorkingAgreement = {
  id: 'wa-001',
  title: 'Accelerator Team Working Agreement',
  description: 'This working agreement outlines how our team collaborates, communicates, and delivers value together.',
  lastUpdated: new Date().toISOString(),
  version: 1.0,
  status: 'draft',
  teamMembers: [
    'Alex Johnson',
    'Maria Garcia',
    'David Chen',
    'Sarah Williams',
    'James Wilson',
    'Priya Patel'
  ],
  approvals: [
    { memberId: 'Alex Johnson', approved: true, approvedAt: new Date().toISOString() },
    { memberId: 'Maria Garcia', approved: false },
    { memberId: 'David Chen', approved: false },
    { memberId: 'Sarah Williams', approved: false },
    { memberId: 'James Wilson', approved: false },
    { memberId: 'Priya Patel', approved: false }
  ],
  sections: [
    {
      id: 'section-1',
      title: 'Team Purpose',
      content: 'Our team exists to accelerate the delivery of value through our platform by removing impediments, providing technical guidance, and fostering collaboration across teams.',
      isEditing: false
    },
    {
      id: 'section-2',
      title: 'Working Hours & Availability',
      content: '- Core hours: 10:00 AM - 3:00 PM local time\n- Team members will update their calendar and Slack status when unavailable\n- Response time expectations: 2 hours during working hours, next business day otherwise\n- Time off requests should be communicated at least 1 week in advance when possible',
      isEditing: false
    },
    {
      id: 'section-3',
      title: 'Meetings & Ceremonies',
      content: '- Daily standup: 9:30 AM, 15 minutes max\n- Sprint planning: Every other Monday, 1:00 PM - 3:00 PM\n- Backlog refinement: Every Thursday, 11:00 AM - 12:00 PM\n- Sprint review: Every other Friday, 10:00 AM - 11:00 AM\n- Retrospective: Every other Friday, 11:15 AM - 12:15 PM\n- No-meeting Wednesdays: Focus time for deep work\n- All meetings must have an agenda shared at least 4 hours in advance',
      isEditing: false
    },
    {
      id: 'section-4',
      title: 'Communication Channels',
      content: '- Slack: For quick questions, updates, and informal discussions\n- Email: For formal communications with stakeholders and external teams\n- JIRA: For task tracking, assignments, and status updates\n- Confluence: For documentation and knowledge sharing\n- Google Meet: For virtual meetings and collaboration sessions',
      isEditing: false
    },
    {
      id: 'section-5',
      title: 'Decision Making',
      content: '- We use consensus-based decision making for major decisions\n- For technical decisions, we follow the advice process: person closest to the work makes the decision after seeking input\n- Decisions are documented in Confluence with context, alternatives considered, and rationale\n- We respect decisions once made, but can revisit if new information emerges',
      isEditing: false
    },
    {
      id: 'section-6',
      title: 'Workflow & Process',
      content: '- We follow a two-week sprint cycle\n- Definition of Ready: User story has clear acceptance criteria, is estimated, and dependencies are identified\n- Definition of Done: Code reviewed, tests written, documentation updated, deployed to staging\n- WIP limits: Maximum of 2 tasks per person in progress\n- Pull requests should be reviewed within 24 hours\n- Bugs take priority over new features unless otherwise agreed',
      isEditing: false
    },
    {
      id: 'section-7',
      title: 'Feedback & Conflict Resolution',
      content: '- We provide feedback directly, respectfully, and privately\n- We focus on behaviors and impact, not personalities\n- We address conflicts early through direct conversation\n- If direct conversation doesn\'t resolve the issue, we involve a neutral third party\n- We conduct regular 1:1 feedback sessions between team members',
      isEditing: false
    },
    {
      id: 'section-8',
      title: 'Learning & Growth',
      content: '- Each team member has 4 hours per week dedicated to learning and skill development\n- We share knowledge through bi-weekly lunch & learn sessions\n- We maintain a team learning backlog in Confluence\n- We rotate responsibilities to build cross-functional skills\n- We celebrate learning from failures as well as successes',
      isEditing: false
    }
  ]
};
