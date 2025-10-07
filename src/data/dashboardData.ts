import { OutcomeData, ProgressData, AccomplishmentData, BacklogItem, ReleaseNote, ProductAdoptionData } from '../types';

export const outcomeData: OutcomeData = {
  shortTerm: [
    {
      title: "DevLake Data Integration",
      description: "Integrate key data sources into DevLake platform to provide comprehensive metrics",
      metrics: [
        {
          name: "Data Sources Connected",
          target: "8 sources",
          current: "5 sources",
          status: "on-track"
        },
        {
          name: "Data Completeness",
          target: "95%",
          current: "82%",
          status: "at-risk"
        }
      ]
    },
    {
      title: "Developer Productivity Metrics",
      description: "Implement DORA and other key engineering metrics to measure team performance",
      metrics: [
        {
          name: "DORA Metrics Coverage",
          target: "100%",
          current: "75%",
          status: "on-track"
        },
        {
          name: "Teams Onboarded",
          target: "12",
          current: "8",
          status: "on-track"
        }
      ]
    }
  ],
  midTerm: [
    {
      title: "Engineering Insights Platform",
      description: "Build comprehensive analytics platform for engineering performance insights",
      metrics: [
        {
          name: "Custom Dashboard Adoption",
          target: "80%",
          current: "45%",
          status: "at-risk"
        },
        {
          name: "Data-Driven Decisions",
          target: "65% of teams",
          current: "38% of teams",
          status: "on-track"
        }
      ]
    },
    {
      title: "Cross-Team Collaboration Metrics",
      description: "Develop metrics to measure and improve cross-team collaboration efficiency",
      metrics: [
        {
          name: "Teams Using Collaboration Metrics",
          target: "90%",
          current: "52%",
          status: "on-track"
        },
        {
          name: "Collaboration Bottleneck Reduction",
          target: "40%",
          current: "22%",
          status: "at-risk"
        }
      ]
    }
  ],
  longTerm: [
    {
      title: "AI-Powered Engineering Insights",
      description: "Implement AI/ML capabilities to provide predictive analytics for engineering teams",
      metrics: [
        {
          name: "Prediction Accuracy",
          target: "85%",
          current: "62%",
          status: "at-risk"
        },
        {
          name: "Teams Using Predictive Insights",
          target: "75%",
          current: "15%",
          status: "off-track"
        }
      ]
    },
    {
      title: "Engineering Excellence Framework",
      description: "Establish organization-wide framework for measuring and improving engineering excellence",
      metrics: [
        {
          name: "Framework Adoption",
          target: "100% of teams",
          current: "35% of teams",
          status: "at-risk"
        },
        {
          name: "Engineering Efficiency Improvement",
          target: "30%",
          current: "12%",
          status: "on-track"
        }
      ]
    }
  ]
};

export const progressData: ProgressData = {
  leadTimeForChanges: {
    name: "Lead Time for Changes",
    description: "Average time from code commit to production deployment",
    target: 3,
    current: 4.5,
    previousPeriod: 6.2,
    trend: "down",
    status: "positive"
  },
  deploymentFrequency: {
    name: "Deployment Frequency",
    description: "How often code is deployed to production",
    target: 20,
    current: 12,
    previousPeriod: 8,
    trend: "up",
    status: "positive"
  },
  meanTimeToRecover: {
    name: "Mean Time to Recover",
    description: "Average time to restore service after a failure",
    target: 4,
    current: 6.5,
    previousPeriod: 8.2,
    trend: "down",
    status: "positive"
  },
  changeFailureRate: {
    name: "Change Failure Rate",
    description: "Percentage of changes that result in failures",
    target: 5,
    current: 8.5,
    previousPeriod: 12,
    trend: "down",
    status: "positive"
  },
  qualityReliability: {
    name: "Quality & Reliability",
    description: "Product quality metrics and reliability scores",
    target: 98,
    current: 96.5,
    previousPeriod: 95.2,
    trend: "up",
    status: "positive"
  },
  technicalCommunity: {
    name: "Technical Community",
    description: "Engagement and growth of our technical community",
    target: 85,
    current: 78,
    previousPeriod: 72,
    trend: "up",
    status: "positive"
  },
  engineerSatisfactionScore: {
    name: "Engineer Satisfaction Score",
    description: "Overall satisfaction score from engineering team surveys",
    target: 90,
    current: 82,
    previousPeriod: 78,
    trend: "up",
    status: "positive"
  },
  dsoHowWeShowUp: {
    name: "DSO How we show up",
    description: "The team enables everyone to show up as their whole authentic selves, in a creative mindset",
    target: 95,
    current: 76,
    previousPeriod: 70,
    trend: "up",
    status: "neutral"
  },
  dsoWhatWeFocusOn: {
    name: "DSO What we focus on",
    description: "The team is focused on mission and outcomes",
    target: 90,
    current: 85,
    previousPeriod: 80,
    trend: "up",
    status: "positive"
  },
  dsoHowWeAreOrganized: {
    name: "DSO How we are organized",
    description: "The team collaborates in a flat network of entrepreneurial teams, working closely with customers",
    target: 85,
    current: 68,
    previousPeriod: 62,
    trend: "up",
    status: "neutral"
  },
  dsoHowWeCreateValue: {
    name: "DSO How we create value",
    description: "The team serves customers with value-added products and flowing resources to where they are most valuable",
    target: 90,
    current: 72,
    previousPeriod: 65,
    trend: "up",
    status: "positive"
  },
  dsoHowWeGetWorkDone: {
    name: "DSO How we get work done",
    description: "The team strives for continuous improvement, experimenting and learning in rapid cycles",
    target: 95,
    current: 79,
    previousPeriod: 71,
    trend: "up",
    status: "positive"
  },
  costEfficiency: {
    name: "Cost Efficiency",
    description: "Operational cost reduction and efficiency gains",
    target: 25,
    current: 18,
    previousPeriod: 15,
    trend: "up",
    status: "positive"
  },
  costDriverOptimization: {
    name: "Cost-Driver Optimization",
    description: "Identification and optimization of key cost drivers across the platform",
    target: 85,
    current: 62,
    previousPeriod: 48,
    trend: "up",
    status: "positive"
  },
  techSimplification: {
    name: "Technology Simplification",
    description: "Reduction in technical complexity and legacy systems",
    target: 40,
    current: 22,
    previousPeriod: 18,
    trend: "up",
    status: "neutral"
  },
  goldenStatePercentage: {
    name: "% Golden State",
    description: "Percentage of systems meeting golden state architecture standards",
    target: 100,
    current: 65,
    previousPeriod: 58,
    trend: "up",
    status: "positive"
  },
  architecturalIntegrityIndex: {
    name: "Architectural Integrity Index",
    description: "Measure of architectural compliance and technical debt reduction",
    target: 90,
    current: 72,
    previousPeriod: 68,
    trend: "up",
    status: "positive"
  },
  deliveryProcessAutomated: {
    name: "Delivery Process Automated",
    description: "Percentage of delivery pipeline steps that are fully automated",
    target: 95,
    current: 78,
    previousPeriod: 70,
    trend: "up",
    status: "positive"
  },
  selfServiceDeveloped: {
    name: "Self Service Developed",
    description: "Percentage of platform capabilities available through self-service",
    target: 85,
    current: 52,
    previousPeriod: 45,
    trend: "up",
    status: "neutral"
  },
  securityCompliance: {
    name: "Security & Compliance",
    description: "Security posture and regulatory compliance",
    target: 100,
    current: 92,
    previousPeriod: 88,
    trend: "up",
    status: "neutral"
  },
  complianceRate: {
    name: "Statutory & Regulatory Compliance Rate",
    description: "Percentage of regulatory requirements met across all systems",
    target: 100,
    current: 94,
    previousPeriod: 90,
    trend: "up",
    status: "positive"
  },
  vulnerabilityCount: {
    name: "Vulnerability Count",
    description: "Number of identified security vulnerabilities across systems",
    target: 0,
    current: 12,
    previousPeriod: 18,
    trend: "down",
    status: "positive"
  }
};

export const productAdoptionData: ProductAdoptionData = {
  metrics: [
    {
      name: "Monthly Active Users",
      value: 1842,
      target: 2500,
      unit: "users",
      trend: "up",
      changePercentage: "+12.4%"
    },
    {
      name: "Team Adoption Rate",
      value: 68,
      target: 85,
      unit: "%",
      trend: "up",
      changePercentage: "+5.2%"
    },
    {
      name: "User Retention",
      value: 76,
      target: 90,
      unit: "%",
      trend: "flat",
      changePercentage: "+0.8%"
    },
    {
      name: "New User Onboarding Completion",
      value: 62,
      target: 80,
      unit: "%",
      trend: "down",
      changePercentage: "-3.5%"
    }
  ],
  featureUsage: [
    {
      name: "DORA Metrics Dashboard",
      usagePercentage: 87,
      status: "high",
      description: "Most teams actively use this for performance tracking"
    },
    {
      name: "Custom Metric Builder",
      usagePercentage: 42,
      status: "medium",
      description: "Adoption growing but limited to more technical users"
    },
    {
      name: "Team Comparison Tool",
      usagePercentage: 65,
      status: "medium",
      description: "Popular among engineering managers and leadership"
    },
    {
      name: "Predictive Analytics",
      usagePercentage: 23,
      status: "low",
      description: "New feature with limited adoption so far"
    },
    {
      name: "API Integration",
      usagePercentage: 18,
      status: "low",
      description: "Used primarily by platform teams for automation"
    }
  ],
  userResearch: [
    {
      title: "Onboarding Friction",
      description: "New users struggle with initial setup and configuration, leading to incomplete onboarding",
      sentiment: "negative",
      source: "User Interviews (n=12)",
      date: "May 2025"
    },
    {
      title: "Dashboard Value Perception",
      description: "Teams using DORA metrics report 28% better alignment on performance goals",
      sentiment: "positive",
      source: "User Survey (n=156)",
      date: "April 2025"
    },
    {
      title: "Feature Discovery Issues",
      description: "42% of users were unaware of key features that would benefit their workflow",
      sentiment: "negative",
      source: "Product Analytics",
      date: "June 2025"
    },
    {
      title: "Integration Satisfaction",
      description: "GitHub and Jira integrations received high satisfaction scores (4.6/5)",
      sentiment: "positive",
      source: "In-app Feedback",
      date: "May 2025"
    },
    {
      title: "Mobile Usage Patterns",
      description: "Leadership users access dashboards via mobile 3x more than individual contributors",
      sentiment: "neutral",
      source: "Usage Analytics",
      date: "June 2025"
    },
    {
      title: "Custom Metrics Complexity",
      description: "Users find the custom metric builder powerful but overly complex for simple use cases",
      sentiment: "neutral",
      source: "Usability Testing",
      date: "May 2025"
    }
  ],
  recommendations: [
    {
      title: "Streamline Onboarding Experience",
      description: "Implement guided onboarding flow with interactive tutorials and pre-configured templates",
      impact: "high",
      effort: "medium",
      timeframe: "Q3 2025"
    },
    {
      title: "Feature Awareness Campaign",
      description: "Create in-app tooltips and feature spotlight series to highlight underutilized capabilities",
      impact: "medium",
      effort: "low",
      timeframe: "Q3 2025"
    },
    {
      title: "Simplified Custom Metrics Builder",
      description: "Develop a basic mode for the custom metrics builder with common templates and wizards",
      impact: "high",
      effort: "medium",
      timeframe: "Q4 2025"
    },
    {
      title: "Mobile Experience Enhancement",
      description: "Optimize mobile dashboard views for executive users with simplified KPI displays",
      impact: "medium",
      effort: "medium",
      timeframe: "Q3 2025"
    },
    {
      title: "Integration Expansion",
      description: "Prioritize GitLab and Azure DevOps integrations based on user demand",
      impact: "high",
      effort: "high",
      timeframe: "Q4 2025"
    }
  ]
};

export const releaseNotesData: ReleaseNote[] = [
  {
    sprintNumber: 3,
    sprintName: "Sprint 3: Metrics Expansion",
    releaseDate: "2025-06-12",
    features: [
      {
        title: "Jira Cloud Connector",
        description: "Released new Jira Cloud connector with advanced workflow analytics capabilities and custom field mapping",
        impact: "Enabled 5 new project management metrics and onboarded 4 additional teams to the platform",
        team: ["Integration Team", "Product Management"],
        type: "feature"
      },
      {
        title: "Dashboard Export Functionality",
        description: "Added ability to export dashboards as PDF reports with custom branding and annotations",
        impact: "Streamlined monthly reporting process, saving teams an average of 3 hours per reporting cycle",
        team: ["Frontend Development", "UX Design"],
        type: "enhancement"
      },
      {
        title: "Jenkins Data Loss Fix",
        description: "Fixed critical bug causing intermittent data loss when collecting build data from Jenkins instances",
        impact: "Restored data integrity for CI/CD metrics and improved reliability of deployment frequency calculations",
        team: ["Backend Team", "QA Team"],
        type: "bugfix"
      }
    ]
  },
  {
    sprintNumber: 2,
    sprintName: "Sprint 2: Visualization & Insights",
    releaseDate: "2025-05-29",
    features: [
      {
        title: "DORA Metrics Dashboard",
        description: "Launched comprehensive DORA metrics dashboard with historical trends and team comparisons",
        impact: "Adopted by 8 engineering teams, resulting in 15% improvement in deployment frequency",
        team: ["Analytics Team", "Frontend Development"],
        type: "feature"
      },
      {
        title: "Cross-Team Metrics Standardization",
        description: "Implemented standardized metric definitions across teams to ensure consistent performance evaluations",
        impact: "New standardized framework improved cross-team collaboration efficiency by 32%",
        team: ["Metrics Team", "Engineering Leadership"],
        type: "enhancement"
      },
      {
        title: "Data Pipeline Performance Optimization",
        description: "Optimized ETL pipeline to address performance bottlenecks causing delays in metric updates",
        impact: "Reduced data processing time by 65% and improved real-time metrics accuracy",
        team: ["Data Engineering", "Performance Team"],
        type: "enhancement"
      }
    ]
  },
  {
    sprintNumber: 1,
    sprintName: "Sprint 1: Foundation & Integration",
    releaseDate: "2025-05-15",
    features: [
      {
        title: "GitHub Integration Enhancement",
        description: "Implemented advanced GitHub data collection capabilities with PR review metrics and code quality insights",
        impact: "Increased data completeness by 28% and enabled 3 new engineering metrics for teams",
        team: ["Integration Team", "Backend Development"],
        type: "feature"
      },
      {
        title: "User Authentication System",
        description: "Implemented SSO integration with corporate identity providers and role-based access control",
        impact: "Simplified onboarding process and improved security compliance for enterprise customers",
        team: ["Security Team", "Backend Development"],
        type: "feature"
      },
      {
        title: "Mobile Responsive Dashboards",
        description: "Enhanced dashboard layouts to be fully responsive on mobile and tablet devices",
        impact: "Increased dashboard usage by 24% among engineering managers who can now access metrics on-the-go",
        team: ["Frontend Development", "UX Design"],
        type: "enhancement"
      }
    ]
  }
];

export const accomplishmentData: AccomplishmentData[] = [
  {
    title: "GitHub Integration Enhancement",
    description: "Implemented advanced GitHub data collection capabilities with PR review metrics and code quality insights",
    date: "2025-05-15",
    type: "accomplishment",
    impact: "Increased data completeness by 28% and enabled 3 new engineering metrics for teams",
    team: ["Integration Team", "Backend Development"]
  },
  {
    title: "DORA Metrics Dashboard Release",
    description: "Launched comprehensive DORA metrics dashboard with historical trends and team comparisons",
    date: "2025-06-02",
    type: "accomplishment",
    impact: "Adopted by 8 engineering teams, resulting in 15% improvement in deployment frequency",
    team: ["Analytics Team", "Frontend Development"]
  },
  {
    title: "Data Pipeline Performance Bottlenecks",
    description: "Identified critical performance issues in our ETL pipeline causing delays in metric updates",
    date: "2025-04-18",
    type: "learning",
    impact: "Optimization reduced data processing time by 65% and improved real-time metrics accuracy",
    team: ["Data Engineering", "Performance Team"]
  },
  {
    title: "Cross-Team Metrics Standardization",
    description: "Learned that inconsistent metric definitions across teams were causing misaligned performance evaluations",
    date: "2025-05-28",
    type: "learning",
    impact: "New standardized framework improved cross-team collaboration efficiency by 32%",
    team: ["Metrics Team", "Engineering Leadership"]
  },
  {
    title: "Jira Cloud Connector Launch",
    description: "Successfully released new Jira Cloud connector with advanced workflow analytics capabilities",
    date: "2025-06-12",
    type: "accomplishment",
    impact: "Enabled 5 new project management metrics and onboarded 4 additional teams to the platform",
    team: ["Integration Team", "Product Management"]
  }
];

export const backlogData: BacklogItem[] = [
  {
    id: "BL-001",
    title: "Implement GitLab data connector",
    description: "Develop a new connector for GitLab to extract commit, MR, and CI/CD pipeline data for DORA metrics",
    priority: "high",
    effort: "large",
    impact: "high",
    assignee: "Integration Team",
    dueDate: "2025-08-15",
    status: "in-progress",
    tags: ["Integration", "GitLab", "DORA Metrics"]
  },
  {
    id: "BL-002",
    title: "Enhance PR review metrics dashboard",
    description: "Add detailed code review metrics including review time, comments per PR, and reviewer distribution",
    priority: "medium",
    effort: "medium",
    impact: "high",
    assignee: "Frontend Team",
    dueDate: "2025-07-20",
    status: "not-started",
    tags: ["Dashboard", "Code Review", "Metrics"]
  },
  {
    id: "BL-003",
    title: "Implement data quality validation framework",
    description: "Create automated tests to validate data consistency and completeness across all data sources",
    priority: "high",
    effort: "medium",
    impact: "high",
    assignee: "Data Quality Team",
    dueDate: "2025-08-01",
    status: "in-progress",
    tags: ["Data Quality", "Testing", "Automation"]
  },
  {
    id: "BL-004",
    title: "Develop team collaboration network analysis",
    description: "Implement network graph visualization showing cross-team collaboration patterns based on PR reviews and comments",
    priority: "medium",
    effort: "large",
    impact: "medium",
    assignee: "Analytics Team",
    dueDate: "2025-09-10",
    status: "not-started",
    tags: ["Collaboration", "Network Analysis", "Visualization"]
  },
  {
    id: "BL-005",
    title: "Fix Jenkins connector data loss issue",
    description: "Resolve critical bug causing intermittent data loss when collecting build data from Jenkins instances",
    priority: "high",
    effort: "medium",
    impact: "high",
    assignee: "Backend Team",
    dueDate: "2025-07-05",
    status: "blocked",
    tags: ["Bug Fix", "Jenkins", "Data Collection"]
  },
  {
    id: "BL-006",
    title: "Implement custom metric builder UI",
    description: "Create drag-and-drop interface for users to build custom engineering metrics from available data sources",
    priority: "medium",
    effort: "large",
    impact: "high",
    assignee: "UI/UX Team",
    dueDate: "2025-08-25",
    status: "in-progress",
    tags: ["Custom Metrics", "UI/UX", "User Empowerment"]
  },
  {
    id: "BL-007",
    title: "Optimize ETL pipeline performance",
    description: "Improve data processing efficiency to reduce latency in metric updates and dashboard refreshes",
    priority: "high",
    effort: "medium",
    impact: "medium",
    assignee: "Performance Team",
    dueDate: "2025-07-15",
    status: "in-progress",
    tags: ["Performance", "ETL", "Optimization"]
  },
  {
    id: "BL-008",
    title: "Implement team benchmarking feature",
    description: "Add capability to compare team performance metrics against industry benchmarks and internal standards",
    priority: "medium",
    effort: "medium",
    impact: "high",
    assignee: "Analytics Team",
    dueDate: "2025-08-10",
    status: "not-started",
    tags: ["Benchmarking", "Comparison", "Team Performance"]
  },
  {
    id: "BL-009",
    title: "Create documentation for custom metrics API",
    description: "Develop comprehensive API documentation for teams to create and integrate custom metrics",
    priority: "low",
    effort: "small",
    impact: "medium",
    assignee: "Documentation Team",
    dueDate: "2025-07-30",
    status: "not-started",
    tags: ["Documentation", "API", "Developer Experience"]
  },
  {
    id: "BL-010",
    title: "Implement AI-based anomaly detection",
    description: "Develop machine learning models to detect anomalies in engineering metrics and provide early warnings",
    priority: "medium",
    effort: "large",
    impact: "high",
    assignee: "Data Science Team",
    dueDate: "2025-09-20",
    status: "not-started",
    tags: ["AI/ML", "Anomaly Detection", "Predictive Analytics"]
  }
];
