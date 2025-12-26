import { useState } from 'react';
import { Download, Film, Music, Mic, Play, Settings } from 'lucide-react';
import { Storyboard } from '@/types/project';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface ExportPanelProps {
  storyboards: Storyboard[];
}

export function ExportPanel({ storyboards }: ExportPanelProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [settings, setSettings] = useState({
    resolution: '1080p',
    enableBGM: true,
    enableSFX: true,
    enableVoice: true,
    enableLipSync: true,
    enableAnimation: true,
  });

  const generatedCount = storyboards.filter(s => s.generatedImage).length;

  const handleExport = async () => {
    if (generatedCount === 0) {
      toast.error('请先生成分镜图');
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    // Simulate export process
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setExportProgress(i);
    }

    setIsExporting(false);
    toast.success('视频导出完成！');
  };

  const handlePreview = () => {
    if (generatedCount === 0) {
      toast.error('请先生成分镜图');
      return;
    }
    toast.info('预览功能开发中');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b-2 border-foreground">
        <h2 className="text-xl font-bold">导出设置</h2>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Status */}
          <div className="p-4 border-2 border-foreground bg-secondary/30">
            <h3 className="font-bold mb-3">项目状态</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>总分镜数</span>
                <span className="font-mono">{storyboards.length}</span>
              </div>
              <div className="flex justify-between">
                <span>已生成分镜图</span>
                <span className="font-mono">{generatedCount} / {storyboards.length}</span>
              </div>
              <div className="h-2 bg-secondary border border-foreground mt-2">
                <div 
                  className="h-full bg-foreground transition-all"
                  style={{ width: storyboards.length ? `${(generatedCount / storyboards.length) * 100}%` : '0%' }}
                />
              </div>
            </div>
          </div>

          {/* Video Settings */}
          <div className="space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              <Film className="w-5 h-5" />
              视频设置
            </h3>
            
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-3 border-2 border-foreground">
                <span>输出分辨率</span>
                <Select 
                  value={settings.resolution} 
                  onValueChange={(v) => setSettings(prev => ({ ...prev, resolution: v }))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="720p">720p</SelectItem>
                    <SelectItem value="1080p">1080p</SelectItem>
                    <SelectItem value="2k">2K</SelectItem>
                    <SelectItem value="4k">4K</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-3 border-2 border-foreground">
                <div>
                  <span>动态效果</span>
                  <p className="text-xs text-muted-foreground">镜头运动、景深变化</p>
                </div>
                <Switch 
                  checked={settings.enableAnimation}
                  onCheckedChange={(v) => setSettings(prev => ({ ...prev, enableAnimation: v }))}
                />
              </div>
            </div>
          </div>

          {/* Audio Settings */}
          <div className="space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              <Music className="w-5 h-5" />
              音频设置
            </h3>
            
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-3 border-2 border-foreground">
                <div>
                  <span>背景音乐</span>
                  <p className="text-xs text-muted-foreground">AI生成配乐</p>
                </div>
                <Switch 
                  checked={settings.enableBGM}
                  onCheckedChange={(v) => setSettings(prev => ({ ...prev, enableBGM: v }))}
                />
              </div>

              <div className="flex items-center justify-between p-3 border-2 border-foreground">
                <div>
                  <span>环境音效</span>
                  <p className="text-xs text-muted-foreground">场景氛围音</p>
                </div>
                <Switch 
                  checked={settings.enableSFX}
                  onCheckedChange={(v) => setSettings(prev => ({ ...prev, enableSFX: v }))}
                />
              </div>
            </div>
          </div>

          {/* Voice Settings */}
          <div className="space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              <Mic className="w-5 h-5" />
              配音设置
            </h3>
            
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-3 border-2 border-foreground">
                <div>
                  <span>TTS配音</span>
                  <p className="text-xs text-muted-foreground">文本转语音</p>
                </div>
                <Switch 
                  checked={settings.enableVoice}
                  onCheckedChange={(v) => setSettings(prev => ({ ...prev, enableVoice: v }))}
                />
              </div>

              <div className="flex items-center justify-between p-3 border-2 border-foreground">
                <div>
                  <span>口型动画</span>
                  <p className="text-xs text-muted-foreground">自动匹配语音</p>
                </div>
                <Switch 
                  checked={settings.enableLipSync}
                  onCheckedChange={(v) => setSettings(prev => ({ ...prev, enableLipSync: v }))}
                />
              </div>
            </div>
          </div>

          {/* Export Progress */}
          {isExporting && (
            <div className="p-4 border-2 border-foreground">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">正在导出...</span>
                <span className="font-mono text-sm">{exportProgress}%</span>
              </div>
              <Progress value={exportProgress} className="h-3" />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handlePreview}
              disabled={isExporting}
            >
              <Play className="w-4 h-4 mr-2" />
              预览
            </Button>
            <Button 
              className="flex-1"
              onClick={handleExport}
              disabled={isExporting || generatedCount === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? '导出中...' : '导出视频'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
