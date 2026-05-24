export interface SortingBar {
  value: number;
  state: 'normal' | 'compare' | 'swap' | 'sorted' | 'pivot';
}

export interface GraphNode {
  id: string;
  label?: string;
  state: 'normal' | 'visited' | 'active' | 'path';
}

export interface GraphEdge {
  source: string;
  target: string;
  active: boolean;
  weight?: number;
}

export interface DPCell {
  r: number;
  c: number;
  val: number | string;
  state: 'normal' | 'active' | 'fill' | 'dependency';
}

export interface AlgorithmFrame {
  step: number;
  log: string;
  highlightedLine: number; // Index of the line in pseudocode to highlight
  variables: Record<string, string | number | number[] | null>; // Active variable watch panel
  highlights: {
    indices?: number[];
    window?: [number, number];
    bars?: SortingBar[];
    nodes?: GraphNode[];
    edges?: GraphEdge[];
    grid?: DPCell[][];
    binaryVal?: string;
    matches?: boolean[];
  };
}

export interface DSATelemetryConcept {
  id: number;
  slug: string;
  title: string;
  category: string;
  visualType: 'linear' | 'binary-search' | 'recursion-tree' | 'tree' | 'graph' | 'dp-grid' | 'bit-register' | 'string-match' | 'interval' | 'math';
  complexity: { time: string; space: string };
  blueprint: string;
  pseudocode: {
    java: string[];
    typescript: string[];
  };
  sampleCode: { java: string; typescript: string };
  interviewQuestions: { question: string; answer: string; tradeoffs: string; chaosScenario: string }[];
  telemetrySteps: AlgorithmFrame[];
}
