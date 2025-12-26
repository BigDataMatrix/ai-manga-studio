import { useState } from 'react';
import { ViewMode } from '@/types/project';
import { useProject } from '@/hooks/useProject';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { ScriptEditor } from '@/components/views/ScriptEditor';
import { CharacterLibrary } from '@/components/views/CharacterLibrary';
import { SceneLibrary } from '@/components/views/SceneLibrary';
import { StoryboardEditor } from '@/components/views/StoryboardEditor';
import { ExportPanel } from '@/components/views/ExportPanel';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('script');
  const {
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
    canUndo,
    canRedo,
    newProject,
  } = useProject();

  const renderView = () => {
    switch (currentView) {
      case 'script':
        return (
          <ScriptEditor 
            script={project.script} 
            onScriptChange={updateScript} 
          />
        );
      case 'characters':
        return (
          <CharacterLibrary
            characters={project.characters}
            onAddCharacter={addCharacter}
            onUpdateCharacter={updateCharacter}
            onDeleteCharacter={deleteCharacter}
          />
        );
      case 'scenes':
        return (
          <SceneLibrary
            scenes={project.scenes}
            onAddScene={addScene}
            onUpdateScene={updateScene}
            onDeleteScene={deleteScene}
          />
        );
      case 'storyboard':
        return (
          <StoryboardEditor
            storyboards={project.storyboards}
            characters={project.characters}
            scenes={project.scenes}
            script={project.script}
            onAddStoryboard={addStoryboard}
            onUpdateStoryboard={updateStoryboard}
            onDeleteStoryboard={deleteStoryboard}
            onReorderStoryboards={reorderStoryboards}
          />
        );
      case 'export':
        return <ExportPanel storyboards={project.storyboards} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        projectName={project.name}
        onNewProject={newProject}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
      />
      <main className="flex-1 overflow-hidden">
        {renderView()}
      </main>
    </div>
  );
};

export default Index;
