'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
import { toast } from 'sonner';
import { useImage } from '@/hooks/useImage';
import { Loader2, RotateCcw, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { TransformImage, TransformOptions } from '@/types/image.type';
import { getTransformedImage, transformImage } from '@/lib/api/image';
import { use } from 'react';
import { convertQueryToTransformOption } from '@/lib/utils';

const defaultTransformOptions: TransformOptions = {
    w: 800,
    h: 600,
    format: 'jpeg',
    fit: 'cover',
    quality: 80,
    grayscale: false,
    blur: 0,
    sharpen: false,
    rotate: 0,
    enhance: false,
};

interface props {
    params: Promise<{ id: string }>;
}

export default function TransformPage({ params }: props) {
    const { id } = use(params);

    const { image, isLoading } = useImage(id);
    const [transformOptions, setTransformOptions] =
        useState<TransformOptions>(defaultTransformOptions);
    const [isTransforming, setIsTransforming] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [transformHistory, setTransformHistory] = useState<TransformImage[]>([]);

    useEffect(() => {
        const fetchTransformed = async () => {
            const transformedImage = await getTransformedImage(id);
            setTransformHistory(transformedImage);
        };
        fetchTransformed();
    }, [id]);

    useEffect(() => {
        if (image) {
            setPreviewUrl(image.originalUrl);
        }
    }, [image]);

    const handleTransform = async () => {
        if (!image) return;

        setIsTransforming(true);
        try {
            const transformedImage = await transformImage(id, transformOptions);
            setPreviewUrl(transformedImage.url);
            setTransformHistory(prev => [transformedImage, ...prev]);
            toast.success('Image transformed successfully');
        } catch (error) {
            console.log(error);
            toast.error('Failed to transform image');
        } finally {
            setIsTransforming(false);
        }
    };

    const handleHistoryItemClick = (item: TransformImage) => {
        setPreviewUrl(item.url);
        const querystring = JSON.parse(item.options);
        const queryOption = convertQueryToTransformOption(querystring);
        setTransformOptions(queryOption);
    };

    const handleRemoveHistoryItem = (itemId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setTransformHistory(prev => prev.filter(item => item.id !== itemId));
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!image) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-destructive">Failed to load image</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-7xl px-4 py-8">
            <div className="grid gap-8 lg:grid-cols-2">
                <div className="space-y-4">
                    <Card className="relative aspect-square overflow-hidden">
                        <Image
                            src={previewUrl}
                            alt="Preview"
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </Card>

                    {/* Transform History */}
                    <div className="space-y-2">
                        {transformHistory && transformHistory.length > 0 && (
                            <div className="grid grid-cols-4 gap-2">
                                {transformHistory.map(item => (
                                    <Card
                                        key={item.id}
                                        className="group relative aspect-square cursor-pointer overflow-hidden"
                                        onClick={() => handleHistoryItemClick(item)}
                                    >
                                        <Image
                                            src={item.url}
                                            alt="History item"
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={e => handleRemoveHistoryItem(item.id, e)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {transformHistory && transformHistory.length === 0 && (
                            <p className="text-muted-foreground text-center text-sm">
                                No transform history yet
                            </p>
                        )}
                    </div>
                </div>

                {/* Transform Options */}
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
                                        value={transformOptions.w || image.width}
                                        onChange={e =>
                                            setTransformOptions({
                                                ...transformOptions,
                                                w: e.target.value
                                                    ? parseInt(e.target.value)
                                                    : undefined,
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="height">Height</Label>
                                    <Input
                                        id="height"
                                        type="number"
                                        value={transformOptions.h || image.height}
                                        onChange={e =>
                                            setTransformOptions({
                                                ...transformOptions,
                                                h: e.target.value
                                                    ? parseInt(e.target.value)
                                                    : undefined,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="format">Format</Label>
                                <Select
                                    value={transformOptions.format}
                                    onValueChange={(value: TransformOptions['format']) =>
                                        setTransformOptions({ ...transformOptions, format: value })
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
                                    value={transformOptions.fit}
                                    onValueChange={(value: TransformOptions['fit']) =>
                                        setTransformOptions({ ...transformOptions, fit: value })
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
                                <Label htmlFor="quality">
                                    Quality: {transformOptions.quality}%
                                </Label>
                                <Slider
                                    id="quality"
                                    min={1}
                                    max={100}
                                    step={1}
                                    value={[transformOptions.quality]}
                                    onValueChange={([value]) =>
                                        setTransformOptions({ ...transformOptions, quality: value })
                                    }
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="effects" className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="grayscale">Grayscale</Label>
                                <Switch
                                    id="grayscale"
                                    checked={transformOptions.grayscale}
                                    onCheckedChange={checked =>
                                        setTransformOptions({
                                            ...transformOptions,
                                            grayscale: checked,
                                        })
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <Label htmlFor="sharpen">Sharpen</Label>
                                <Switch
                                    id="sharpen"
                                    checked={transformOptions.sharpen}
                                    onCheckedChange={checked =>
                                        setTransformOptions({
                                            ...transformOptions,
                                            sharpen: checked,
                                        })
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="blur">Blur: {transformOptions.blur}</Label>
                                <Slider
                                    id="blur"
                                    min={0}
                                    max={100}
                                    step={1}
                                    value={[transformOptions.blur]}
                                    onValueChange={([value]) =>
                                        setTransformOptions({ ...transformOptions, blur: value })
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="rotate">Rotate: {transformOptions.rotate}°</Label>
                                <Slider
                                    id="rotate"
                                    min={0}
                                    max={360}
                                    step={1}
                                    value={[transformOptions.rotate]}
                                    onValueChange={([value]) =>
                                        setTransformOptions({ ...transformOptions, rotate: value })
                                    }
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="advanced" className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="enhance">Enhance</Label>
                                <Switch
                                    id="enhance"
                                    checked={transformOptions.enhance}
                                    onCheckedChange={checked =>
                                        setTransformOptions({
                                            ...transformOptions,
                                            enhance: checked,
                                        })
                                    }
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="crop-left">Crop Left</Label>
                                    <Input
                                        id="crop-left"
                                        type="number"
                                        value={transformOptions.crop?.left || 0}
                                        onChange={e =>
                                            setTransformOptions({
                                                ...transformOptions,
                                                crop: {
                                                    left: parseInt(e.target.value) || 0,
                                                    top: transformOptions.crop?.top || 0,
                                                    width: transformOptions.crop?.width || 0,
                                                    height: transformOptions.crop?.height || 0,
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
                                        value={transformOptions.crop?.top || 0}
                                        onChange={e =>
                                            setTransformOptions({
                                                ...transformOptions,
                                                crop: {
                                                    left: transformOptions.crop?.left || 0,
                                                    top: parseInt(e.target.value) || 0,
                                                    width: transformOptions.crop?.width || 0,
                                                    height: transformOptions.crop?.height || 0,
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
                                        value={transformOptions.crop?.width || 0}
                                        onChange={e =>
                                            setTransformOptions({
                                                ...transformOptions,
                                                crop: {
                                                    left: transformOptions.crop?.left || 0,
                                                    top: transformOptions.crop?.top || 0,
                                                    width: parseInt(e.target.value) || 0,
                                                    height: transformOptions.crop?.height || 0,
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
                                        value={transformOptions.crop?.height || 0}
                                        onChange={e =>
                                            setTransformOptions({
                                                ...transformOptions,
                                                crop: {
                                                    left: transformOptions.crop?.left || 0,
                                                    top: transformOptions.crop?.top || 0,
                                                    width: transformOptions.crop?.width || 0,
                                                    height: parseInt(e.target.value) || 0,
                                                },
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <div className="flex gap-4">
                        <Button
                            className="flex-1 gap-2"
                            onClick={handleTransform}
                            disabled={isTransforming}
                        >
                            {isTransforming ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <RotateCcw className="h-4 w-4" />
                            )}
                            Transform
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
