import { useState } from 'react';
import { Plus, Sparkles, Trash2, GripVertical, RefreshCw, ChevronDown, Image as ImageIcon } from 'lucide-react';
import { Storyboard, Character, Scene } from '@/types/project';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface StoryboardEditorProps {
  storyboards: Storyboard[];
  characters: Character[];
  scenes: Scene[];
  script: string;
  onAddStoryboard: (storyboard: Omit<Storyboard, 'id'>) => void;
  onUpdateStoryboard: (id: string, updates: Partial<Storyboard>) => void;
  onDeleteStoryboard: (id: string) => void;
  onReorderStoryboards: (storyboards: Storyboard[]) => void;
}

const SHOT_TYPES: { value: Storyboard['shotType']; label: string }[] = [
  { value: 'close-up', label: '特写' },
  { value: 'medium', label: '中景' },
  { value: 'wide', label: '全景' },
  { value: 'bird-eye', label: '俯视' },
  { value: 'low-angle', label: '仰视' },
];

export function StoryboardEditor({
  storyboards,
  characters,
  scenes,
  script,
  onAddStoryboard,
  onUpdateStoryboard,
  onDeleteStoryboard,
  onReorderStoryboards,
}: StoryboardEditorProps) {
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
  const [isAutoGenerating, setIsAutoGenerating] = useState(false);

  const handleAutoGenerate = async () => {
    if (!script.trim()) {
      toast.error('请先编写剧本内容');
      return;
    }
    setIsAutoGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate auto-generation of storyboards from script
    const newBoards = [
      { description: '开场：主角走进场景', shotType: 'wide' as const },
      { description: '主角的特写镜头', shotType: 'close-up' as const },
      { description: '对话场景', shotType: 'medium' as const },
    ];

    newBoards.forEach((board, idx) => {
      onAddStoryboard({
        order: storyboards.length + idx + 1,
        description: board.description,
        prompt: `${board.description}, ${board.shotType} shot, cinematic`,
        shotType: board.shotType,
        characterIds: [],
        isGenerating: false,
      });
    });

    setIsAutoGenerating(false);
    toast.success(`已生成 ${newBoards.length} 个分镜`);
  };

  const handleAddBoard = () => {
    onAddStoryboard({
      order: storyboards.length + 1,
      description: '',
      prompt: '',
      shotType: 'medium',
      characterIds: [],
      isGenerating: false,
    });
  };

  const handleGenerateImage = async (id: string) => {
    onUpdateStoryboard(id, { isGenerating: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
    onUpdateStoryboard(id, { 
      isGenerating: false,
      generatedImage: '/placeholder.svg',
    });
    toast.success('分镜图已生成');
  };

  const selectedStoryboard = storyboards.find(s => s.id === selectedBoard);

  return (
    <div className="h-full flex">
      {/* Left Panel - Storyboard List */}
      <div className="w-80 border-r-2 border-foreground flex flex-col">
        <div className="p-4 border-b-2 border-foreground">
          <h2 className="text-xl font-bold mb-3">分镜列表</h2>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              className="flex-1"
              onClick={handleAutoGenerate}
              disabled={isAutoGenerating}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              自动生成
            </Button>
            <Button variant="outline" size="sm" onClick={handleAddBoard}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-2">
          {storyboards.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground p-4 text-center">
              <div>
                <ImageIcon className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">暂无分镜</p>
                <p className="text-xs mt-1">点击"自动生成"从剧本创建分镜</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {storyboards.map((board, idx) => (
                <div
                  key={board.id}
                  onClick={() => setSelectedBoard(board.id)}
                  className={`p-3 border-2 cursor-pointer transition-all
                    ${selectedBoard === board.id 
                      ? 'border-foreground bg-accent shadow-xs' 
                      : 'border-border hover:border-foreground'
                    }`}
                >
                  <div className="flex items-start gap-2">
                    <GripVertical className="w-4 h-4 text-muted-foreground mt-1 cursor-grab" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm">镜头 {idx + 1}</span>
                        <span className="text-xs text-muted-foreground">
                          {SHOT_TYPES.find(t => t.value === board.shotType)?.label}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate mt-1">
                        {board.description || '未添加描述'}
                      </p>
                      {board.generatedImage && (
                        <div className="mt-2 aspect-video bg-secondary border border-border overflow-hidden">
                          <img 
                            src={board.generatedImage} 
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Edit Detail */}
      <div className="flex-1 flex flex-col">
        {selectedStoryboard ? (
          <>
            <div className="p-4 border-b-2 border-foreground flex items-center justify-between">
              <h3 className="font-bold">
                镜头 {storyboards.findIndex(s => s.id === selectedBoard) + 1} 详情
              </h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  onDeleteStoryboard(selectedStoryboard.id);
                  setSelectedBoard(null);
                  toast.success('镜头已删除');
                }}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                删除
              </Button>
            </div>

            <div className="flex-1 overflow-auto p-4">
              <div className="max-w-2xl space-y-4">
                {/* Shot Type */}
                <div>
                  <label className="text-sm font-medium mb-2 block">镜头类型</label>
                  <Select
                    value={selectedStoryboard.shotType}
                    onValueChange={(value: Storyboard['shotType']) => 
                      onUpdateStoryboard(selectedStoryboard.id, { shotType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SHOT_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium mb-2 block">镜头描述</label>
                  <Textarea
                    value={selectedStoryboard.description}
                    onChange={(e) => 
                      onUpdateStoryboard(selectedStoryboard.id, { description: e.target.value })
                    }
                    placeholder="描述这个镜头的内容..."
                    rows={3}
                  />
                </div>

                {/* Prompt */}
                <div>
                  <label className="text-sm font-medium mb-2 block">生成提示词</label>
                  <Textarea
                    value={selectedStoryboard.prompt}
                    onChange={(e) => 
                      onUpdateStoryboard(selectedStoryboard.id, { prompt: e.target.value })
                    }
                    placeholder="用于AI生成的详细提示词..."
                    rows={4}
                  />
                </div>

                {/* Characters */}
                <div>
                  <label className="text-sm font-medium mb-2 block">出场角色</label>
                  <div className="flex flex-wrap gap-2">
                    {characters.map(char => (
                      <button
                        key={char.id}
                        onClick={() => {
                          const ids = selectedStoryboard.characterIds.includes(char.id)
                            ? selectedStoryboard.characterIds.filter(id => id !== char.id)
                            : [...selectedStoryboard.characterIds, char.id];
                          onUpdateStoryboard(selectedStoryboard.id, { characterIds: ids });
                        }}
                        className={`px-3 py-1 text-sm border-2 transition-colors
                          ${selectedStoryboard.characterIds.includes(char.id)
                            ? 'bg-foreground text-background border-foreground'
                            : 'border-foreground hover:bg-accent'
                          }`}
                      >
                        {char.name}
                      </button>
                    ))}
                    {characters.length === 0 && (
                      <p className="text-sm text-muted-foreground">暂无角色，请先在角色库中添加</p>
                    )}
                  </div>
                </div>

                {/* Scene */}
                <div>
                  <label className="text-sm font-medium mb-2 block">场景</label>
                  <Select
                    value={selectedStoryboard.sceneId || ''}
                    onValueChange={(value) => 
                      onUpdateStoryboard(selectedStoryboard.id, { sceneId: value || undefined })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择场景" />
                    </SelectTrigger>
                    <SelectContent>
                      {scenes.map(scene => (
                        <SelectItem key={scene.id} value={scene.id}>
                          {scene.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Generated Image */}
                <div>
                  <label className="text-sm font-medium mb-2 block">分镜图</label>
                  {selectedStoryboard.generatedImage ? (
                    <div className="space-y-2">
                      <div className="aspect-video border-2 border-foreground overflow-hidden">
                        <img 
                          src={selectedStoryboard.generatedImage} 
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleGenerateImage(selectedStoryboard.id)}
                        disabled={selectedStoryboard.isGenerating}
                      >
                        <RefreshCw className={`w-4 h-4 mr-2 ${selectedStoryboard.isGenerating ? 'animate-spin' : ''}`} />
                        重新生成
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="aspect-video border-2 border-dashed border-foreground flex items-center justify-center bg-secondary/30">
                        <p className="text-muted-foreground">点击下方按钮生成分镜图</p>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => handleGenerateImage(selectedStoryboard.id)}
                        disabled={selectedStoryboard.isGenerating}
                      >
                        <Sparkles className={`w-4 h-4 mr-2 ${selectedStoryboard.isGenerating ? 'animate-spin' : ''}`} />
                        {selectedStoryboard.isGenerating ? '生成中...' : '生成分镜图'}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <ChevronDown className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>选择左侧的分镜进行编辑</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
