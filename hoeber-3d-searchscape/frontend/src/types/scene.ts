export type Vector3Tuple = [number, number, number];

export interface TopicLane {
  topic: string;
  lane: number;
  embedding: number[];
}

export interface QueryNode {
  query: string;
  topic: string;
  timestamp: string;
  sessionId: string;
  metrics: {
    clicks: number;
    dwellSeconds: number;
    results: number;
    engagement: number;
  };
  position: Vector3Tuple;
  embedding: number[];
}

export interface TerrainPoint {
  bucket: number;
  x: number;
  height: number;
  topTopics: string[];
}

export interface SceneData {
  metadata: {
    start: string;
    end: string;
    bucketMinutes: number;
    topics: TopicLane[];
  };
  terrainProfile: TerrainPoint[];
  queries: QueryNode[];
}

