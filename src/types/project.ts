export interface Character {
  id: string;
  name: string;
  description: string;
  referenceImages: string[];
  style: string;
  createdAt: Date;
}

export interface Scene {
  id: string;
  name: string;
  description: string;
  style: string;
  generatedImage?: string;
  createdAt: Date;
}

export interface Storyboard {
  id: string;
  order: number;
  description: string;
  prompt: string;
  shotType: 'close-up' | 'medium' | 'wide' | 'bird-eye' | 'low-angle';
  characterIds: string[];
  sceneId?: string;
  generatedImage?: string;
  isGenerating: boolean;
}

export interface Project {
  id: string;
  name: string;
  script: string;
  characters: Character[];
  scenes: Scene[];
  storyboards: Storyboard[];
  createdAt: Date;
  updatedAt: Date;
}

export type ViewMode = 'script' | 'characters' | 'scenes' | 'storyboard' | 'export';
