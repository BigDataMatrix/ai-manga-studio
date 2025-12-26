import { useState, useRef, useCallback } from 'react';
import { Sparkles, Upload, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface ScriptEditorProps {
  script: string;
  onScriptChange: (script: string) => void;
}

export function ScriptEditor({ script, onScriptChange }: ScriptEditorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      onScriptChange(text);
      toast.success('剧本导入成功');
    };
    reader.readAsText(file);
  }, [onScriptChange]);

  const handleAIExpand = useCallback(async () => {
    if (!script.trim()) {
      toast.error('请先输入剧本内容');
      return;
    }
    setIsGenerating(true);
    // Simulate AI expansion
    await new Promise(resolve => setTimeout(resolve, 1500));
    const expanded = script + '\n\n【AI续写】\n故事继续发展，角色之间的冲突逐渐升级...';
    onScriptChange(expanded);
    setIsGenerating(false);
    toast.success('AI续写完成');
  }, [script, onScriptChange]);

  const handleAIContinue = useCallback(async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const continued = script + '\n\n下一幕场景中，主角面临着新的挑战...';
    onScriptChange(continued);
    setIsGenerating(false);
    toast.success('续写完成');
  }, [script, onScriptChange]);

  // Parse markers from script
  const parseMarkers = useCallback((text: string) => {
    const characters = [...text.matchAll(/@(\S+)/g)].map(m => m[1]);
    const scenes = [...text.matchAll(/#(\S+)/g)].map(m => m[1]);
    return { characters: [...new Set(characters)], scenes: [...new Set(scenes)] };
  }, []);

  const markers = parseMarkers(script);

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b-2 border-foreground">
        <div className="flex items-center gap-2">
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".txt,.md"
              className="hidden"
              onChange={handleFileUpload}
            />
            <Button variant="outline" size="sm" asChild>
              <span>
                <Upload className="w-4 h-4 mr-2" />
                导入剧本
              </span>
            </Button>
          </label>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAIExpand}
            disabled={isGenerating}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI扩写
          </Button>
          <Button 
            size="sm" 
            onClick={handleAIContinue}
            disabled={isGenerating}
          >
            <Wand2 className="w-4 h-4 mr-2" />
            AI续写
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex">
        <div className="flex-1 p-4">
          <Textarea
            ref={textareaRef}
            value={script}
            onChange={(e) => onScriptChange(e.target.value)}
            placeholder={`在此输入剧本内容...\n\n提示：\n- 使用 @角色名 标记角色\n- 使用 #场景名 标记场景\n\n例如：\n#咖啡馆内-白天\n@小明 走进咖啡馆，看到 @小红 正坐在窗边。`}
            className="h-full min-h-[400px] resize-none font-mono text-base leading-relaxed"
          />
        </div>

        {/* Markers Panel */}
        <div className="w-64 border-l-2 border-foreground p-4 bg-secondary/30">
          <div className="mb-6">
            <h3 className="font-bold mb-3 text-sm uppercase tracking-wide">检测到的角色</h3>
            {markers.characters.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {markers.characters.map(char => (
                  <span 
                    key={char} 
                    className="px-3 py-1 bg-foreground text-background text-sm font-medium"
                  >
                    @{char}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">使用 @角色名 标记角色</p>
            )}
          </div>

          <div>
            <h3 className="font-bold mb-3 text-sm uppercase tracking-wide">检测到的场景</h3>
            {markers.scenes.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {markers.scenes.map(scene => (
                  <span 
                    key={scene} 
                    className="px-3 py-1 border-2 border-foreground text-sm font-medium"
                  >
                    #{scene}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">使用 #场景名 标记场景</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
