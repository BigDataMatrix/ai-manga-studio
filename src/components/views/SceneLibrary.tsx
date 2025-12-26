import { useState } from 'react';
import { Plus, Sparkles, Trash2, Edit2, MapPin } from 'lucide-react';
import { Scene } from '@/types/project';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface SceneLibraryProps {
  scenes: Scene[];
  onAddScene: (scene: Omit<Scene, 'id' | 'createdAt'>) => void;
  onUpdateScene: (id: string, updates: Partial<Scene>) => void;
  onDeleteScene: (id: string) => void;
}

const STYLE_PRESETS = ['日漫风格', '国潮风格', '写实风格', '赛博朋克', '水墨风格'];

export function SceneLibrary({
  scenes,
  onAddScene,
  onUpdateScene,
  onDeleteScene,
}: SceneLibraryProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingScene, setEditingScene] = useState<Scene | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    style: STYLE_PRESETS[0],
    generatedImage: undefined as string | undefined,
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      style: STYLE_PRESETS[0],
      generatedImage: undefined,
    });
    setEditingScene(null);
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast.error('请输入场景名称');
      return;
    }

    if (editingScene) {
      onUpdateScene(editingScene.id, formData);
      toast.success('场景已更新');
    } else {
      onAddScene(formData);
      toast.success('场景已添加');
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (scene: Scene) => {
    setEditingScene(scene);
    setFormData({
      name: scene.name,
      description: scene.description,
      style: scene.style,
      generatedImage: scene.generatedImage,
    });
    setIsDialogOpen(true);
  };

  const handleAIGenerate = async () => {
    if (!formData.description.trim()) {
      toast.error('请先输入场景描述');
      return;
    }
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setFormData(prev => ({
      ...prev,
      generatedImage: '/placeholder.svg',
    }));
    setIsGenerating(false);
    toast.success('场景生成完成');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b-2 border-foreground">
        <h2 className="text-xl font-bold">场景资产库</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              添加场景
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingScene ? '编辑场景' : '创建新场景'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium mb-2 block">场景名称</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="输入场景名称"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">场景描述</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="描述场景的环境、氛围、光线等..."
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">风格</label>
                <div className="flex flex-wrap gap-2">
                  {STYLE_PRESETS.map(style => (
                    <button
                      key={style}
                      onClick={() => setFormData(prev => ({ ...prev, style }))}
                      className={`px-3 py-1 text-sm border-2 transition-colors
                        ${formData.style === style 
                          ? 'bg-foreground text-background border-foreground' 
                          : 'border-foreground hover:bg-accent'
                        }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">场景预览</label>
                {formData.generatedImage ? (
                  <div className="relative aspect-video border-2 border-foreground overflow-hidden">
                    <img 
                      src={formData.generatedImage} 
                      alt="" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-video border-2 border-dashed border-foreground flex items-center justify-center bg-secondary/30">
                    <p className="text-muted-foreground">点击下方按钮生成场景</p>
                  </div>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={handleAIGenerate}
                  disabled={isGenerating}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isGenerating ? '生成中...' : 'AI生成场景'}
                </Button>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleSubmit}>
                  {editingScene ? '保存' : '创建'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Grid */}
      <div className="flex-1 p-4 overflow-auto">
        {scenes.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>暂无场景</p>
              <p className="text-sm mt-1">点击上方按钮添加场景</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenes.map(scene => (
              <div 
                key={scene.id} 
                className="border-2 border-foreground bg-card shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-video bg-secondary flex items-center justify-center overflow-hidden">
                  {scene.generatedImage ? (
                    <img 
                      src={scene.generatedImage} 
                      alt={scene.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-muted-foreground">
                      <MapPin className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-bold truncate">{scene.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{scene.style}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{scene.description}</p>
                  <div className="flex gap-1 mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleEdit(scene)}
                    >
                      <Edit2 className="w-3 h-3 mr-1" />
                      编辑
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        onDeleteScene(scene.id);
                        toast.success('场景已删除');
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
