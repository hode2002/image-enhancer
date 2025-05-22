import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Loader2, RotateCcw } from 'lucide-react';
import { TransformOptions } from '@/types/image.type';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface TransformOptionsProps {
    options: TransformOptions;
    onOptionsChange: (options: TransformOptions) => void;
    onTransform: () => void;
    onDownload: () => void;
    isTransforming: boolean;
    hasTransformedImage: boolean;
    originalWidth: number;
    originalHeight: number;
}

export function TransformOptionsComponent({
    options,
    onOptionsChange,
    onTransform,
    onDownload,
    isTransforming,
    hasTransformedImage,
    originalWidth,
    originalHeight,
}: TransformOptionsProps) {
    return (
        <div className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Basic</TabsTrigger>
                    <TabsTrigger value="effects">Effects</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="width">Width</Label>
                            <Input
                                id="width"
                                type="number"
                                value={options.w || originalWidth}
                                onChange={e =>
                                    onOptionsChange({
                                        ...options,
                                        w: parseInt(e.target.value) || 0,
                                    })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="height">Height</Label>
                            <Input
                                id="height"
                                type="number"
                                value={options.h || originalHeight}
                                onChange={e =>
                                    onOptionsChange({
                                        ...options,
                                        h: parseInt(e.target.value) || 0,
                                    })
                                }
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="format">Format</Label>
                        <Select
                            value={options.format}
                            onValueChange={(value: TransformOptions['format']) =>
                                onOptionsChange({ ...options, format: value })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="jpeg">JPEG</SelectItem>
                                <SelectItem value="png">PNG</SelectItem>
                                <SelectItem value="webp">WebP</SelectItem>
                                <SelectItem value="avif">AVIF</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fit">Fit</Label>
                        <Select
                            value={options.fit}
                            onValueChange={(value: TransformOptions['fit']) =>
                                onOptionsChange({ ...options, fit: value })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cover">Cover</SelectItem>
                                <SelectItem value="contain">Contain</SelectItem>
                                <SelectItem value="fill">Fill</SelectItem>
                                <SelectItem value="inside">Inside</SelectItem>
                                <SelectItem value="outside">Outside</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="quality">Quality: {options.quality}%</Label>
                        <Slider
                            id="quality"
                            min={1}
                            max={100}
                            step={1}
                            value={[options.quality]}
                            onValueChange={([value]) =>
                                onOptionsChange({ ...options, quality: value })
                            }
                        />
                    </div>
                </TabsContent>

                <TabsContent value="effects" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="grayscale">Grayscale</Label>
                        <Switch
                            id="grayscale"
                            checked={options.grayscale}
                            onCheckedChange={checked =>
                                onOptionsChange({
                                    ...options,
                                    grayscale: checked,
                                })
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label htmlFor="sharpen">Sharpen</Label>
                        <Switch
                            id="sharpen"
                            checked={options.sharpen}
                            onCheckedChange={checked =>
                                onOptionsChange({
                                    ...options,
                                    sharpen: checked,
                                })
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="blur">Blur: {options.blur}</Label>
                        <Slider
                            id="blur"
                            min={0}
                            max={100}
                            step={1}
                            value={[options.blur]}
                            onValueChange={([value]) =>
                                onOptionsChange({ ...options, blur: value })
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="rotate">Rotate: {options.rotate}°</Label>
                        <Slider
                            id="rotate"
                            min={0}
                            max={360}
                            step={1}
                            value={[options.rotate]}
                            onValueChange={([value]) =>
                                onOptionsChange({ ...options, rotate: value })
                            }
                        />
                    </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="enhance">Enhance</Label>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroup
                                    value={options.enhance}
                                    onValueChange={value => {
                                        onOptionsChange({
                                            ...options,
                                            enhance: value as '2x' | '4x' | '8x',
                                        });
                                    }}
                                    className="flex items-center gap-4"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="2x" id="enhance-2x" />
                                        <Label htmlFor="enhance-2x" className="text-sm">
                                            2x
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="4x" id="enhance-4x" />
                                        <Label htmlFor="enhance-4x" className="text-sm">
                                            4x
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="8x" id="enhance-8x" />
                                        <Label htmlFor="enhance-8x" className="text-sm">
                                            8x
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="crop-left">Crop Left</Label>
                            <Input
                                id="crop-left"
                                type="number"
                                value={options.crop?.left || 0}
                                onChange={e =>
                                    onOptionsChange({
                                        ...options,
                                        crop: {
                                            left: parseInt(e.target.value) || 0,
                                            top: options.crop?.top || 0,
                                            width: options.crop?.width || 0,
                                            height: options.crop?.height || 0,
                                        },
                                    })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="crop-top">Crop Top</Label>
                            <Input
                                id="crop-top"
                                type="number"
                                value={options.crop?.top || 0}
                                onChange={e =>
                                    onOptionsChange({
                                        ...options,
                                        crop: {
                                            left: options.crop?.left || 0,
                                            top: parseInt(e.target.value) || 0,
                                            width: options.crop?.width || 0,
                                            height: options.crop?.height || 0,
                                        },
                                    })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="crop-width">Crop Width</Label>
                            <Input
                                id="crop-width"
                                type="number"
                                value={options.crop?.width || 0}
                                onChange={e =>
                                    onOptionsChange({
                                        ...options,
                                        crop: {
                                            left: options.crop?.left || 0,
                                            top: options.crop?.top || 0,
                                            width: parseInt(e.target.value) || 0,
                                            height: options.crop?.height || 0,
                                        },
                                    })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="crop-height">Crop Height</Label>
                            <Input
                                id="crop-height"
                                type="number"
                                value={options.crop?.height || 0}
                                onChange={e =>
                                    onOptionsChange({
                                        ...options,
                                        crop: {
                                            left: options.crop?.left || 0,
                                            top: options.crop?.top || 0,
                                            width: options.crop?.width || 0,
                                            height: parseInt(e.target.value) || 0,
                                        },
                                    })
                                }
                            />
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            <div className="flex flex-col gap-4">
                <Button className="flex-1 gap-2" onClick={onTransform} disabled={isTransforming}>
                    {isTransforming ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <RotateCcw className="h-4 w-4" />
                    )}
                    Transform
                </Button>

                {hasTransformedImage && (
                    <Button
                        variant="outline"
                        className="flex-1 cursor-pointer gap-2"
                        onClick={onDownload}
                    >
                        <Download className="h-4 w-4" />
                        Download Transformed Image
                    </Button>
                )}
            </div>
        </div>
    );
}
