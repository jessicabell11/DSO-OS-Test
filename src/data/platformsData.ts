export const platformsList = [
  "CH Consumer & Customer Experience Platform",
  "CH Product Experience Platform",
  "CH Data Assets, Analytics, and AI Platform",
  "CS Customer Experience Platform",
  "CS Product Fulfillment Platform",
  "CS Product Pipeline Platform",
  "CS Global Data Assets & Analytics Platform",
  "Cyber Security Culture & Enablement Platform",
  "Cyber Security Architecture & Innovation Platform",
  "Cyber Security Assurance & Advancement Platform",
  "Cyber Security Technologies Platform",
  "Cyber Defense Center Platform",
  "Employee Platform",
  "Enterprise Enablement Platform",
  "Finance Platform",
  "Application Operations Platform",
  "Infrastructure Platform",
  "Integration Platform",
  "Digital Workplace Platform",
  "PH Customer Engagement Platform",
  "PH Drug Innovation Platform",
  "PH Regulatory Compliance Platform",
  "PH Decision Science & AI Platform",
  "Engineering Enablement Platform",
  "Veeva Enablement Platform",
  "Integrated Planning & Logistics Platform",
  "Manufacturing Enablement Platform",
  "Lab Enablement Platform",
  "AI & Intelligent Automation Platform",
  "Enterprise Data & Analytics Platform"
];

// Group platforms by category for easier filtering
export const platformCategories = {
  "Consumer Health": [
    "CH Consumer & Customer Experience Platform",
    "CH Product Experience Platform",
    "CH Data Assets, Analytics, and AI Platform"
  ],
  "Crop Science": [
    "CS Customer Experience Platform",
    "CS Product Fulfillment Platform",
    "CS Product Pipeline Platform",
    "CS Global Data Assets & Analytics Platform"
  ],
  "Pharma": [
    "PH Customer Engagement Platform",
    "PH Drug Innovation Platform",
    "PH Regulatory Compliance Platform",
    "PH Decision Science & AI Platform"
  ],
  "Enabling Functions": [
    "Employee Platform",
    "Enterprise Enablement Platform",
    "Finance Platform",
    "Enterprise Data & Analytics Platform",
    "AI & Intelligent Automation Platform"
  ],
  "Enablement": [
    "Engineering Enablement Platform",
    "Veeva Enablement Platform",
    "Integrated Planning & Logistics Platform",
    "Manufacturing Enablement Platform",
    "Lab Enablement Platform"
  ],
  "IT Foundations": [
    "Application Operations Platform",
    "Infrastructure Platform",
    "Integration Platform",
    "Digital Workplace Platform"
  ],
  "Cyber Security": [
    "Cyber Security Culture & Enablement Platform",
    "Cyber Security Architecture & Innovation Platform",
    "Cyber Security Assurance & Advancement Platform",
    "Cyber Security Technologies Platform",
    "Cyber Defense Center Platform"
  ]
};

// Get platform category based on platform name
export const getPlatformCategory = (platformName: string): string => {
  for (const [category, platforms] of Object.entries(platformCategories)) {
    if (platforms.includes(platformName)) {
      return category;
    }
  }
  return "Other";
};

// Get platform color based on category
export const getPlatformColor = (platformName: string): string => {
  const category = getPlatformCategory(platformName);
  
  switch (category) {
    case "Consumer Health":
      return "bg-blue-100 text-blue-800";
    case "Crop Science":
      return "bg-green-100 text-green-800";
    case "Pharma":
      return "bg-red-100 text-red-800";
    case "Enabling Functions":
      return "bg-gray-100 text-gray-800";
    case "IT Foundations":
      return "bg-indigo-100 text-indigo-800";
    case "Cyber Security":
      return "bg-purple-100 text-purple-800";
    case "Enablement":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
