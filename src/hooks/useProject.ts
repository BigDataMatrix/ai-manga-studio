import { useState, useCallback, useEffect } from 'react';
import { Project, Character, Scene, Storyboard } from '@/types/project';

const STORAGE_KEY = 'ai-comic-project';

const createDefaultProject = (): Project => ({
  id: crypto.randomUUID(),
  name: '未命名项目',
  script: '',
  characters: [],
  scenes: [],
  storyboards: [],
  createdAt: new Date(),
  updatedAt: new Date(),
});

export function useProject() {
  const [project, setProject] = useState<Project>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return createDefaultProject();
      }
    }
    return createDefaultProject();
  });

  const [history, setHistory] = useState<Project[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Auto-save
  useEffect(() => {
    const timer = setInterval(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
    }, 5000);
    return () => clearInterval(timer);
  }, [project]);

  // Save immediately on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
  }, [project]);

  const saveToHistory = useCallback((newProject: Project) => {
    setHistory(prev => [...prev.slice(0, historyIndex + 1), project]);
    setHistoryIndex(prev => prev + 1);
    setProject(newProject);
  }, [project, historyIndex]);

  const updateScript = useCallback((script: string) => {
    saveToHistory({ ...project, script, updatedAt: new Date() });
  }, [project, saveToHistory]);

  const addCharacter = useCallback((character: Omit<Character, 'id' | 'createdAt'>) => {
    const newChar: Character = {
      ...character,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    saveToHistory({
      ...project,
      characters: [...project.characters, newChar],
      updatedAt: new Date(),
    });
    return newChar;
  }, [project, saveToHistory]);

  const updateCharacter = useCallback((id: string, updates: Partial<Character>) => {
    saveToHistory({
      ...project,
      characters: project.characters.map(c => c.id === id ? { ...c, ...updates } : c),
      updatedAt: new Date(),
    });
  }, [project, saveToHistory]);

  const deleteCharacter = useCallback((id: string) => {
    saveToHistory({
      ...project,
      characters: project.characters.filter(c => c.id !== id),
      updatedAt: new Date(),
    });
  }, [project, saveToHistory]);

  const addScene = useCallback((scene: Omit<Scene, 'id' | 'createdAt'>) => {
    const newScene: Scene = {
      ...scene,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    saveToHistory({
      ...project,
      scenes: [...project.scenes, newScene],
      updatedAt: new Date(),
    });
    return newScene;
  }, [project, saveToHistory]);

  const updateScene = useCallback((id: string, updates: Partial<Scene>) => {
    saveToHistory({
      ...project,
      scenes: project.scenes.map(s => s.id === id ? { ...s, ...updates } : s),
      updatedAt: new Date(),
    });
  }, [project, saveToHistory]);

  const deleteScene = useCallback((id: string) => {
    saveToHistory({
      ...project,
      scenes: project.scenes.filter(s => s.id !== id),
      updatedAt: new Date(),
    });
  }, [project, saveToHistory]);

  const addStoryboard = useCallback((storyboard: Omit<Storyboard, 'id'>) => {
    const newBoard: Storyboard = {
      ...storyboard,
      id: crypto.randomUUID(),
    };
    saveToHistory({
      ...project,
      storyboards: [...project.storyboards, newBoard],
      updatedAt: new Date(),
    });
    return newBoard;
  }, [project, saveToHistory]);

  const updateStoryboard = useCallback((id: string, updates: Partial<Storyboard>) => {
    saveToHistory({
      ...project,
      storyboards: project.storyboards.map(s => s.id === id ? { ...s, ...updates } : s),
      updatedAt: new Date(),
    });
  }, [project, saveToHistory]);

  const deleteStoryboard = useCallback((id: string) => {
    saveToHistory({
      ...project,
      storyboards: project.storyboards.filter(s => s.id !== id),
      updatedAt: new Date(),
    });
  }, [project, saveToHistory]);

  const reorderStoryboards = useCallback((storyboards: Storyboard[]) => {
    saveToHistory({
      ...project,
      storyboards,
      updatedAt: new Date(),
    });
  }, [project, saveToHistory]);

  const undo = useCallback(() => {
    if (historyIndex >= 0) {
      setProject(history[historyIndex]);
      setHistoryIndex(prev => prev - 1);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setProject(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  const newProject = useCallback(() => {
    const fresh = createDefaultProject();
    setProject(fresh);
    setHistory([]);
    setHistoryIndex(-1);
  }, []);

  const renameProject = useCallback((name: string) => {
    setProject(prev => ({ ...prev, name, updatedAt: new Date() }));
  }, []);

  return {
    project,
    updateScript,
    addCharacter,
    updateCharacter,
    deleteCharacter,
    addScene,
    updateScene,
    deleteScene,
    addStoryboard,
    updateStoryboard,
    deleteStoryboard,
    reorderStoryboards,
    undo,
    redo,
    canUndo: historyIndex >= 0,
    canRedo: historyIndex < history.length - 1,
    newProject,
    renameProject,
  };
}
