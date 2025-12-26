import { FileText, Users, MapPin, LayoutGrid, Download, Plus, Undo2, Redo2 } from 'lucide-react';
import { ViewMode } from '@/types/project';
import { Button } from '@/components/ui/button';

interface AppSidebarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  projectName: string;
  onNewProject: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const menuItems: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
  { id: 'script', label: '剧本', icon: <FileText className="w-5 h-5" /> },
  { id: 'characters', label: '角色库', icon: <Users className="w-5 h-5" /> },
  { id: 'scenes', label: '场景库', icon: <MapPin className="w-5 h-5" /> },
  { id: 'storyboard', label: '分镜', icon: <LayoutGrid className="w-5 h-5" /> },
  { id: 'export', label: '导出', icon: <Download className="w-5 h-5" /> },
];

export function AppSidebar({
  currentView,
  onViewChange,
  projectName,
  onNewProject,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: AppSidebarProps) {
  return (
    <aside className="w-64 border-r-2 border-foreground bg-card flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b-2 border-foreground">
        <h1 className="text-xl font-bold tracking-tight">AI漫剧</h1>
        <p className="text-sm text-muted-foreground mt-1 truncate">{projectName}</p>
      </div>

      {/* Actions */}
      <div className="p-4 border-b-2 border-foreground flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onNewProject}
          className="flex-1"
        >
          <Plus className="w-4 h-4 mr-1" />
          新建
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onUndo}
          disabled={!canUndo}
        >
          <Undo2 className="w-4 h-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onRedo}
          disabled={!canRedo}
        >
          <Redo2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all border-2 
                  ${currentView === item.id 
                    ? 'bg-foreground text-background border-foreground shadow-sm' 
                    : 'border-transparent hover:border-foreground'
                  }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t-2 border-foreground">
        <p className="text-xs text-muted-foreground">自动保存已启用</p>
      </div>
    </aside>
  );
}
