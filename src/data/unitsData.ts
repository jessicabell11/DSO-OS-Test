// Units organized by platform
export const unitsByPlatform: Record<string, string[]> = {
  "CH Consumer & Customer Experience Platform": [
    "Digital Marketing",
    "Consumer Insights",
    "E-commerce",
    "Brand Experience"
  ],
  "CH Product Experience Platform": [
    "Product Development",
    "Product Management",
    "Quality Assurance",
    "User Experience"
  ],
  "CH Data Assets, Analytics, and AI Platform": [
    "Data Science",
    "Analytics Engineering",
    "Data Governance",
    "AI Solutions"
  ],
  "CS Customer Experience Platform": [
    "Customer Success",
    "Field Operations",
    "Digital Solutions",
    "Customer Engagement"
  ],
  "CS Product Fulfillment Platform": [
    "Supply Chain",
    "Order Management",
    "Logistics",
    "Inventory Management"
  ],
  "CS Product Pipeline Platform": [
    "R&D",
    "Product Innovation",
    "Testing & Validation",
    "Regulatory Affairs"
  ],
  "CS Global Data Assets & Analytics Platform": [
    "Business Intelligence",
    "Data Engineering",
    "Predictive Analytics",
    "Market Research"
  ],
  "Cyber Security Culture & Enablement Platform": [
    "Security Awareness",
    "Security Training",
    "Compliance",
    "Security Communications"
  ],
  "Cyber Security Architecture & Innovation Platform": [
    "Security Architecture",
    "Security Innovation",
    "Security Standards",
    "Security Design"
  ],
  "Cyber Security Assurance & Advancement Platform": [
    "Security Testing",
    "Vulnerability Management",
    "Security Assessments",
    "Security Audits"
  ],
  "Cyber Security Technologies Platform": [
    "Security Operations",
    "Security Engineering",
    "Security Tools",
    "Security Infrastructure"
  ],
  "Cyber Defense Center Platform": [
    "Threat Intelligence",
    "Incident Response",
    "Security Monitoring",
    "Threat Hunting"
  ],
  "Employee Platform": [
    "HR Technology",
    "Employee Experience",
    "Talent Management",
    "Workforce Analytics"
  ],
  "Enterprise Enablement Platform": [
    "Business Process",
    "Enterprise Architecture",
    "Digital Workplace",
    "Collaboration Tools"
  ],
  "Finance Platform": [
    "Financial Systems",
    "Financial Reporting",
    "Financial Planning",
    "Treasury Management"
  ],
  "Application Operations Platform": [
    "Application Support",
    "Application Monitoring",
    "Release Management",
    "Service Desk"
  ],
  "Infrastructure Platform": [
    "Cloud Infrastructure",
    "Network Operations",
    "Server Management",
    "Storage Solutions"
  ],
  "Integration Platform": [
    "API Management",
    "Enterprise Integration",
    "Middleware",
    "Data Integration"
  ],
  "Digital Workplace Platform": [
    "Workplace Technology",
    "Collaboration Solutions",
    "End User Computing",
    "Digital Assistants"
  ],
  "PH Customer Engagement Platform": [
    "Healthcare Professional Engagement",
    "Patient Solutions",
    "Market Access",
    "Digital Health"
  ],
  "PH Drug Innovation Platform": [
    "Clinical Development",
    "Medical Affairs",
    "Drug Discovery",
    "Regulatory Submissions"
  ],
  "PH Regulatory Compliance Platform": [
    "Regulatory Operations",
    "Compliance Management",
    "Quality Management",
    "Pharmacovigilance"
  ],
  "PH Decision Science & AI Platform": [
    "Clinical Data Science",
    "Real World Evidence",
    "Biostatistics",
    "Medical Informatics"
  ],
  "Engineering Enablement Platform": [
    "DevOps",
    "Engineering Tools",
    "Software Development",
    "Quality Engineering"
  ],
  "Veeva Enablement Platform": [
    "Veeva CRM",
    "Veeva Vault",
    "Veeva Integration",
    "Veeva Analytics"
  ],
  "Integrated Planning & Logistics Platform": [
    "Demand Planning",
    "Supply Planning",
    "Logistics Operations",
    "Inventory Optimization"
  ],
  "Manufacturing Enablement Platform": [
    "Manufacturing Execution",
    "Quality Control",
    "Production Planning",
    "Plant Maintenance"
  ],
  "Lab Enablement Platform": [
    "Lab Information Management",
    "Scientific Computing",
    "Lab Automation",
    "Research Informatics"
  ],
  "AI & Intelligent Automation Platform": [
    "Machine Learning",
    "Robotic Process Automation",
    "Natural Language Processing",
    "Computer Vision"
  ],
  "Enterprise Data & Analytics Platform": [
    "Enterprise Data Warehouse",
    "Master Data Management",
    "Data Governance",
    "Business Intelligence"
  ]
};

// Get all units across all platforms
export const getAllUnits = (): string[] => {
  const allUnits: string[] = [];
  Object.values(unitsByPlatform).forEach(units => {
    units.forEach(unit => {
      if (!allUnits.includes(unit)) {
        allUnits.push(unit);
      }
    });
  });
  return allUnits.sort();
};

// Add a new unit to a platform
export const addUnitToPlatform = (platform: string, unit: string): void => {
  if (!platform || !unit) return;
  
  if (!unitsByPlatform[platform]) {
    unitsByPlatform[platform] = [];
  }
  
  if (!unitsByPlatform[platform].includes(unit)) {
    unitsByPlatform[platform].push(unit);
  }
};
