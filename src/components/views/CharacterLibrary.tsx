import { useState } from 'react';
import { Plus, Upload, Sparkles, Trash2, Edit2 } from 'lucide-react';
import { Character } from '@/types/project';
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

interface CharacterLibraryProps {
  characters: Character[];
  onAddCharacter: (character: Omit<Character, 'id' | 'createdAt'>) => void;
  onUpdateCharacter: (id: string, updates: Partial<Character>) => void;
  onDeleteCharacter: (id: string) => void;
}

const STYLE_PRESETS = ['日漫风格', '国潮风格', '写实风格', '赛博朋克', '水墨风格'];

export function CharacterLibrary({
  characters,
  onAddCharacter,
  onUpdateCharacter,
  onDeleteCharacter,
}: CharacterLibraryProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    style: STYLE_PRESETS[0],
    referenceImages: [] as string[],
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      style: STYLE_PRESETS[0],
      referenceImages: [],
    });
    setEditingCharacter(null);
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast.error('请输入角色名称');
      return;
    }

    if (editingCharacter) {
      onUpdateCharacter(editingCharacter.id, formData);
      toast.success('角色已更新');
    } else {
      onAddCharacter(formData);
      toast.success('角色已添加');
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (character: Character) => {
    setEditingCharacter(character);
    setFormData({
      name: character.name,
      description: character.description,
      style: character.style,
      referenceImages: character.referenceImages,
    });
    setIsDialogOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setFormData(prev => ({
          ...prev,
          referenceImages: [...prev.referenceImages, dataUrl].slice(0, 5),
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAIGenerate = async () => {
    if (!formData.description.trim()) {
      toast.error('请先输入角色描述');
      return;
    }
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    // Simulate generated image
    setFormData(prev => ({
      ...prev,
      referenceImages: [...prev.referenceImages, '/placeholder.svg'].slice(0, 5),
    }));
    setIsGenerating(false);
    toast.success('AI生成完成');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b-2 border-foreground">
        <h2 className="text-xl font-bold">角色资产库</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              添加角色
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingCharacter ? '编辑角色' : '创建新角色'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium mb-2 block">角色名称</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="输入角色名称"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">角色描述</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="描述角色的外观、性格、服饰等特征..."
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
                <label className="text-sm font-medium mb-2 block">参考图 ({formData.referenceImages.length}/5)</label>
                <div className="flex gap-2 flex-wrap mb-2">
                  {formData.referenceImages.map((img, idx) => (
                    <div key={idx} className="relative w-20 h-20 border-2 border-foreground">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          referenceImages: prev.referenceImages.filter((_, i) => i !== idx),
                        }))}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <Button variant="outline" size="sm" asChild>
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        上传参考图
                      </span>
                    </Button>
                  </label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleAIGenerate}
                    disabled={isGenerating}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI生成
                  </Button>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleSubmit}>
                  {editingCharacter ? '保存' : '创建'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Grid */}
      <div className="flex-1 p-4 overflow-auto">
        {characters.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>暂无角色</p>
              <p className="text-sm mt-1">点击上方按钮添加角色</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {characters.map(character => (
              <div 
                key={character.id} 
                className="border-2 border-foreground bg-card shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-square bg-secondary flex items-center justify-center overflow-hidden">
                  {character.referenceImages[0] ? (
                    <img 
                      src={character.referenceImages[0]} 
                      alt={character.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-4xl font-bold text-muted-foreground">
                      {character.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-bold truncate">{character.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{character.style}</p>
                  <div className="flex gap-1 mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleEdit(character)}
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        onDeleteCharacter(character.id);
                        toast.success('角色已删除');
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

function Users(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}
