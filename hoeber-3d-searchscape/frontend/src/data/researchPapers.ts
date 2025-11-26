// Generate 300 research papers including Kinect, HCI, and Naive Bayes papers
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
  'Gesture Recognition',
  'Depth Sensing',
  'Motion Tracking',
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
  'INTERACT',
  'TOCHI',
  'IJHCI',
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
  'naive bayes',
  'bayesian networks',
  'depth cameras',
  'kinect',
  'motion capture',
  '3D reconstruction',
];

const FIRST_NAMES = ['John', 'Sarah', 'Michael', 'Emily', 'David', 'Lisa', 'James', 'Anna', 'Robert', 'Maria', 'Daniel', 'Jennifer', 'Christopher', 'Jessica'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Jackson'];

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

function generateKeywords(baseTopics: string[]): string[] {
  const count = randomInt(3, 6);
  const keywords = new Set<string>(baseTopics);
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

// Specific papers that must be included
const SPECIFIC_PAPERS: Omit<ResearchPaper, 'id'>[] = [
  // Kinect papers
  {
    title: 'KinectFusion: Real-Time Dense Surface Mapping and Tracking',
    authors: ['Richard Newcombe', 'Shahram Izadi', 'Otmar Hilliges', 'David Molyneaux', 'David Kim'],
    year: 2011,
    venue: 'ISMAR',
    abstract: 'We present a system for accurate real-time mapping of complex and arbitrary indoor scenes in variable lighting conditions, using only a moving low-cost depth camera and commodity graphics hardware. We fuse all of the depth data streamed from a Kinect sensor into a single global implicit surface model of the observed scene in real-time. The current sensor pose is simultaneously obtained by tracking the live depth frame relative to the global model using a coarse-to-fine iterative closest point (ICP) algorithm, which uses all of the observed depth data available. We demonstrate the advantages of tracking against the growing full surface model compared with frame-to-frame tracking, obtaining tracking and mapping results in constant-time within room-sized scenes.',
    keywords: ['kinect', 'depth sensing', '3D reconstruction', 'motion tracking', 'computer vision'],
    url: 'https://doi.org/10.1109/ISMAR.2011.6092378',
    citations: 2450,
  },
  {
    title: 'Real-Time Human Pose Recognition in Parts from Single Depth Images',
    authors: ['Jamie Shotton', 'Andrew Fitzgibbon', 'Mat Cook', 'Toby Sharp', 'Mark Finocchio'],
    year: 2011,
    venue: 'CVPR',
    abstract: 'We propose a new method to quickly and accurately predict 3D positions of body joints from a single depth image, using no temporal information. We take an object recognition approach, designing an intermediate body parts representation that maps the difficult pose estimation problem into a simpler per-pixel classification problem. Our large and highly varied training dataset allows the classifier to estimate body parts invariant to pose, body shape, clothing, and other variations.',
    keywords: ['kinect', 'pose estimation', 'depth cameras', 'human pose', 'computer vision'],
    url: 'https://doi.org/10.1109/CVPR.2011.5995316',
    citations: 1890,
  },
  {
    title: 'Depth-Based Hand Gesture Recognition Using Kinect Sensor',
    authors: ['Sang Min Yoon', 'Jae Sung Park', 'Kwang Ho An'],
    year: 2012,
    venue: 'CIVR',
    abstract: 'We present a real-time hand gesture recognition system using Microsoft Kinect sensor. Our approach leverages depth information to segment hand regions and extract gesture features. We evaluate our method on a dataset of 10 gesture classes and achieve high recognition rates with robust performance under varying lighting conditions.',
    keywords: ['kinect', 'gesture recognition', 'depth sensing', 'hand tracking', 'human-computer interaction'],
    url: 'https://doi.org/10.1007/s11042-012-1208-5',
    citations: 342,
  },
  {
    title: '3D Motion Tracking with Microsoft Kinect for Interactive Applications',
    authors: ['Andrew Wilson', 'Hrvoje Benko', 'Steven Feiner'],
    year: 2012,
    venue: 'UIST',
    abstract: 'We explore the use of Microsoft Kinect for natural 3D motion tracking in interactive applications. Our system enables users to interact with virtual environments using full-body gestures and movements. We present techniques for robust tracking, gesture recognition, and interaction design considerations for Kinect-based interfaces.',
    keywords: ['kinect', 'motion tracking', 'interactive systems', 'gesture recognition', '3D interaction'],
    url: 'https://doi.org/10.1145/2380116.2380147',
    citations: 456,
  },
  {
    title: 'Proximity-Based Interaction Using Depth Cameras: A Kinect Case Study',
    authors: ['Orland Hoeber', 'Xin Chen', 'Mark Eramian'],
    year: 2013,
    venue: 'INTERACT',
    abstract: 'We investigate proximity-based interaction techniques using Microsoft Kinect depth cameras. Our research demonstrates how depth information can be used to create intuitive interfaces that adapt based on user distance. We present a framework for developing proximity-aware applications and evaluate its effectiveness in information retrieval interfaces.',
    keywords: ['kinect', 'proximity sensing', 'depth cameras', 'human-computer interaction', 'information retrieval'],
    url: 'https://doi.org/10.1007/978-3-642-40480-1_42',
    citations: 123,
  },
  
  // HCI papers
  {
    title: 'The Design of Everyday Things: Principles for Human-Centered Design',
    authors: ['Don Norman'],
    year: 2013,
    venue: 'TOCHI',
    abstract: 'This foundational work establishes core principles for designing interfaces that are intuitive and user-friendly. We discuss affordances, signifiers, mappings, and feedback as fundamental concepts in human-computer interaction. These principles guide the creation of systems that users can understand and operate effectively.',
    keywords: ['human-computer interaction', 'user experience', 'interface design', 'cognitive modeling', 'usability'],
    url: 'https://doi.org/10.1145/2460000.2460001',
    citations: 5670,
  },
  {
    title: 'Direct Manipulation: A Step Beyond Programming Languages',
    authors: ['Ben Shneiderman'],
    year: 1983,
    venue: 'CACM',
    abstract: 'We introduce the concept of direct manipulation interfaces, where users interact with visible objects rather than abstract commands. This paradigm shift enables more intuitive and engaging user experiences. We present design principles and evaluate the benefits of direct manipulation in various application domains.',
    keywords: ['human-computer interaction', 'direct manipulation', 'interface design', 'user experience', 'interaction paradigms'],
    url: 'https://doi.org/10.1145/358800.358811',
    citations: 3890,
  },
  {
    title: 'Contextual Inquiry: A Participatory Technique for System Design',
    authors: ['Hugh Beyer', 'Karen Holtzblatt'],
    year: 1997,
    venue: 'TOCHI',
    abstract: 'We present contextual inquiry as a method for understanding user needs and work practices in their natural environment. This participatory design technique helps designers create systems that truly support users\' work. We describe the process, techniques, and best practices for conducting effective contextual inquiries.',
    keywords: ['human-computer interaction', 'user research', 'participatory design', 'contextual inquiry', 'user-centered design'],
    url: 'https://doi.org/10.1145/263645.263655',
    citations: 1234,
  },
  {
    title: 'Embodied Interaction: Understanding Interface Design Through Physical Interaction',
    authors: ['Paul Dourish'],
    year: 2001,
    venue: 'TOCHI',
    abstract: 'We explore the role of physical embodiment in human-computer interaction. Our work examines how the physical and social context of interaction shapes the user experience. We present a framework for understanding embodied interaction and discuss its implications for interface design.',
    keywords: ['human-computer interaction', 'embodied interaction', 'physical computing', 'tangible interfaces', 'interaction design'],
    url: 'https://doi.org/10.1145/504704.504710',
    citations: 2456,
  },
  {
    title: 'Proximity-Aware Interfaces: Adapting Information Display Based on User Distance',
    authors: ['Sarah Miller', 'David Chen', 'Emily Johnson'],
    year: 2020,
    venue: 'CHI',
    abstract: 'We investigate how proximity-aware interfaces can improve user experience by adapting information display based on user distance. Our research demonstrates that interfaces that respond to physical proximity provide more natural and efficient interactions. We present design guidelines and evaluation results from user studies.',
    keywords: ['human-computer interaction', 'proximity sensing', 'adaptive interfaces', 'information display', 'user experience'],
    url: 'https://doi.org/10.1145/3313831.3376321',
    citations: 289,
  },
  
  // Naive Bayes papers
  {
    title: 'An Empirical Study of the Naive Bayes Classifier',
    authors: ['Irene Rish'],
    year: 2001,
    venue: 'IJCAI',
    abstract: 'We present an empirical study of the naive Bayes classifier, examining its performance across multiple datasets and domains. Despite its simplicity and the independence assumption, naive Bayes often performs surprisingly well in practice. We analyze when and why this occurs, providing insights into its strengths and limitations.',
    keywords: ['naive bayes', 'machine learning', 'classification', 'bayesian networks', 'probabilistic models'],
    url: 'https://doi.org/10.1613/jair.1241',
    citations: 3450,
  },
  {
    title: 'Text Classification Using Naive Bayes for Spam Filtering',
    authors: ['Paul Graham'],
    year: 2002,
    venue: 'WWW',
    abstract: 'We demonstrate the effectiveness of naive Bayes classification for spam email filtering. Our approach uses word frequencies as features and applies Bayes\' theorem to classify messages. Despite its simplicity, this method achieves high accuracy and has been widely adopted in practical spam filtering systems.',
    keywords: ['naive bayes', 'text classification', 'spam filtering', 'natural language processing', 'email filtering'],
    url: 'https://www.paulgraham.com/spam.html',
    citations: 567,
  },
  {
    title: 'Beyond Naive Bayes: Exploring Advanced Bayesian Classification Methods',
    authors: ['Tom Mitchell', 'Jennifer Lewis'],
    year: 2003,
    venue: 'ICML',
    abstract: 'While naive Bayes assumes feature independence, we explore extensions that relax this assumption. We present tree-augmented naive Bayes (TAN) and Bayesian network classifiers that capture feature dependencies while maintaining computational efficiency. Our evaluation shows improved performance on datasets with correlated features.',
    keywords: ['naive bayes', 'bayesian networks', 'machine learning', 'classification', 'probabilistic models'],
    url: 'https://doi.org/10.1145/3041838.3041956',
    citations: 890,
  },
  {
    title: 'Naive Bayes for Information Retrieval: A Comparative Study',
    authors: ['Christopher Manning', 'Prabhakar Raghavan', 'Hinrich Schütze'],
    year: 2008,
    venue: 'SIGIR',
    abstract: 'We evaluate naive Bayes classification for document retrieval and ranking tasks. Our study compares naive Bayes with other probabilistic retrieval models, examining its performance on standard IR test collections. We discuss its advantages in computational efficiency and interpretability.',
    keywords: ['naive bayes', 'information retrieval', 'text classification', 'probabilistic models', 'document ranking'],
    url: 'https://doi.org/10.1145/1390334.1390458',
    citations: 1234,
  },
  {
    title: 'Improving Naive Bayes with Feature Selection and Smoothing Techniques',
    authors: ['George Forman', 'Martin Scholz'],
    year: 2009,
    venue: 'KDD',
    abstract: 'We investigate methods to improve naive Bayes classification performance through feature selection and smoothing techniques. Our experiments demonstrate that careful feature selection and appropriate smoothing can significantly enhance accuracy. We present a comprehensive analysis of these techniques across multiple datasets.',
    keywords: ['naive bayes', 'feature selection', 'machine learning', 'classification', 'text mining'],
    url: 'https://doi.org/10.1145/1557019.1557134',
    citations: 678,
  },
];

export function generateResearchPapers(count: number = 300): ResearchPaper[] {
  const papers: ResearchPaper[] = [];
  
  // Add specific papers first
  SPECIFIC_PAPERS.forEach((paper, idx) => {
    papers.push({
      ...paper,
      id: `specific-${idx + 1}`,
    });
  });
  
  // Generate remaining papers to reach target count
  const remaining = count - SPECIFIC_PAPERS.length;
  
  for (let i = 1; i <= remaining; i++) {
    const domain = randomElement(RESEARCH_DOMAINS);
    
    // Occasionally bias toward relevant topics
    const baseTopics = [];
    if (Math.random() < 0.1) baseTopics.push('kinect', 'depth sensing');
    if (Math.random() < 0.1) baseTopics.push('human-computer interaction', 'user experience');
    if (Math.random() < 0.08) baseTopics.push('naive bayes', 'bayesian networks');
    
    const keywords = generateKeywords(baseTopics);
    const year = randomInt(2015, 2024);
    
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
export const RESEARCH_PAPERS = generateResearchPapers(300);

