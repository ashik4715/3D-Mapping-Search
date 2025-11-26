// Generate 200 research papers for search
export interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  venue: string;
  abstract: string;
  keywords: string[];
  url: string;
  citations: number;
}

const RESEARCH_DOMAINS = [
  'Information Retrieval',
  'Human-Computer Interaction',
  'Machine Learning',
  'Computer Vision',
  'Natural Language Processing',
  'Data Mining',
  'Web Search',
  'Recommender Systems',
  'User Interfaces',
  'Artificial Intelligence',
];

const VENUES = [
  'SIGIR',
  'CHI',
  'WWW',
  'ICML',
  'NeurIPS',
  'ICCV',
  'ACL',
  'KDD',
  'UIST',
  'RecSys',
  'WSDM',
  'CIKM',
  'CSCW',
  'ICSE',
  'AAAI',
];

const TOPICS = [
  'neural networks',
  'search algorithms',
  'user experience',
  'deep learning',
  'query understanding',
  'interactive systems',
  'ranking models',
  'gesture recognition',
  'proximity sensing',
  'adaptive interfaces',
  'information visualization',
  'collaborative filtering',
  'recommendation systems',
  'natural language',
  'computer vision',
  'machine learning',
  'data mining',
  'web technologies',
  'human factors',
  'cognitive modeling',
];

const FIRST_NAMES = ['John', 'Sarah', 'Michael', 'Emily', 'David', 'Lisa', 'James', 'Anna', 'Robert', 'Maria'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateAuthors(): string[] {
  const count = randomInt(1, 4);
  const authors: string[] = [];
  for (let i = 0; i < count; i++) {
    authors.push(`${randomElement(FIRST_NAMES)} ${randomElement(LAST_NAMES)}`);
  }
  return authors;
}

function generateKeywords(): string[] {
  const count = randomInt(3, 6);
  const keywords = new Set<string>();
  while (keywords.size < count) {
    keywords.add(randomElement(TOPICS));
  }
  return Array.from(keywords);
}

function generateAbstract(domain: string, keywords: string[]): string {
  const templates = [
    `This paper presents a novel approach to ${randomElement(keywords)} in the context of ${domain.toLowerCase()}. We introduce a new framework that addresses key challenges in modern ${domain.toLowerCase()} systems. Our evaluation demonstrates significant improvements over existing methods.`,
    `We investigate the relationship between ${randomElement(keywords)} and ${randomElement(keywords)} within ${domain.toLowerCase()} applications. Through extensive experiments, we show that our proposed method achieves state-of-the-art performance across multiple benchmarks.`,
    `This work explores ${randomElement(keywords)} for enhancing ${domain.toLowerCase()} systems. We propose an innovative technique that combines traditional approaches with modern machine learning methods. Results indicate promising directions for future research.`,
    `Addressing the problem of ${randomElement(keywords)} in ${domain.toLowerCase()}, we present a comprehensive study with both theoretical analysis and empirical validation. Our approach offers practical insights for researchers and practitioners.`,
    `We examine how ${randomElement(keywords)} can improve ${domain.toLowerCase()} through a systematic evaluation framework. The proposed solution demonstrates effectiveness in real-world scenarios with measurable improvements in key metrics.`,
  ];
  return randomElement(templates);
}

function generateTitle(domain: string, keywords: string[]): string {
  const patterns = [
    `A Novel Approach to ${randomElement(keywords).charAt(0).toUpperCase() + randomElement(keywords).slice(1)} in ${domain}`,
    `${domain} Enhancement Through ${randomElement(keywords).charAt(0).toUpperCase() + randomElement(keywords).slice(1)}`,
    `Understanding ${randomElement(keywords).charAt(0).toUpperCase() + randomElement(keywords).slice(1)}: A ${domain} Perspective`,
    `Adaptive ${randomElement(keywords).charAt(0).toUpperCase() + randomElement(keywords).slice(1)} for ${domain} Systems`,
    `Combining ${randomElement(keywords).charAt(0).toUpperCase() + randomElement(keywords).slice(1)} and ${randomElement(keywords).charAt(0).toUpperCase() + randomElement(keywords).slice(1)} in ${domain}`,
    `Real-Time ${randomElement(keywords).charAt(0).toUpperCase() + randomElement(keywords).slice(1)} for ${domain} Applications`,
    `Deep Learning Approaches to ${randomElement(keywords).charAt(0).toUpperCase() + randomElement(keywords).slice(1)} in ${domain}`,
    `User-Centric ${randomElement(keywords).charAt(0).toUpperCase() + randomElement(keywords).slice(1)} in ${domain} Interfaces`,
  ];
  return randomElement(patterns);
}

export function generateResearchPapers(count: number = 200): ResearchPaper[] {
  const papers: ResearchPaper[] = [];
  
  for (let i = 1; i <= count; i++) {
    const domain = randomElement(RESEARCH_DOMAINS);
    const keywords = generateKeywords();
    const year = randomInt(2018, 2024);
    
    papers.push({
      id: `paper-${i}`,
      title: generateTitle(domain, keywords),
      authors: generateAuthors(),
      year,
      venue: randomElement(VENUES),
      abstract: generateAbstract(domain, keywords),
      keywords,
      url: `https://example.com/paper-${i}`,
      citations: randomInt(5, 500),
    });
  }
  
  return papers;
}

// Pre-generated dataset
export const RESEARCH_PAPERS = generateResearchPapers(200);

