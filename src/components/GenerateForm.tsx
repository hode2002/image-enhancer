'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wand2, ChevronDown, ChevronUp, Info, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { AIGenerate, createImage } from '@/lib/api/image';
import { AIGenerateOptions, ImageBasic } from '@/types/image.type';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { uploadImageByUrl } from '@/lib/api/media';
import { useAuth } from '@clerk/nextjs';
import { AxiosProgressEvent } from 'axios';
import { useIsMobile } from '../hooks/use-mobile';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AIGenerateText } from '@/lib/api/text-generator';

interface GeneratedImage {
    id: string;
    url: string;
    prompt: string;
    createdAt: string;
}

const MODELS = [
    { id: 'fluxPro', name: 'Flux Pro' },
    { id: 'fluxDev', name: 'Flux Dev' },
] as const;

const SERVER_CHOICES = [
    { id: 'google_us', name: 'Google US Server' },
    { id: 'azure_lite', name: 'Azure Lite Supercomputer Server' },
    { id: 'artemis_gpu', name: 'Artemis GPU Super cluster' },
    { id: 'nebula_tensor', name: 'NebulaDrive Tensor Server' },
    { id: 'pixel_npu', name: 'PixelNet NPU Server' },
] as const;

export const GenerateForm = () => {
    const { userId } = useAuth();
    const [prompt, setPrompt] = useState(
        'A highly detailed and realistic scene of a majestic Tyrannosaurus Rex standing in a lush, prehistoric jungle at sunset, with vibrant green ferns, towering palm trees, and mist gently rising from the ground. The T-Rex has textured, scaly skin with earthy tones of green and brown, sharp claws, and piercing yellow eyes. The background features a glowing orange and purple sky, with distant mountains and a small herd of smaller dinosaurs grazing. Cinematic lighting, ultra-realistic, 4K resolution, photorealistic style',
    );
    const isMobile = useIsMobile();
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
    const [generationHistory, setGenerationHistory] = useState<GeneratedImage[]>([]);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [selectedModel, setSelectedModel] = useState<string>(MODELS[0].id);
    const [selectedServer, setSelectedServer] = useState<string>(SERVER_CHOICES[0].id);
    const [options, setOptions] = useState<AIGenerateOptions>({
        prompt: '',
        width: 1024,
        height: 1024,
        guidanceScale: 3.5,
        numInferenceSteps: 28,
        randomize: true,
        seed: 0,
        serverChoice: 'Google US Server',
    });
    const [isEnhancingPrompt, setIsEnhancingPrompt] = useState(false);

    const onProgress = (progressEvent: AxiosProgressEvent, loaded: number) => {
        const progress = Math.round((progressEvent.loaded * loaded) / (progressEvent.total || 1));
        setProgress(prev => Math.min(prev + progress, 100));
    };

    const handleGenerate = async () => {
        if (!userId) {
            toast.error('Please login to upload');
            return;
        }

        if (!prompt.trim()) {
            toast.error('Please enter a prompt');
            return;
        }

        setIsGenerating(true);
        setProgress(0);

        try {
            const {
                data: { generatedImageUrl },
            } = await AIGenerate(
                selectedModel,
                {
                    ...options,
                    prompt,
                    serverChoice: selectedModel === 'fluxPro' ? selectedServer : undefined,
                },
                progressEvent => onProgress(progressEvent, 20),
            );

            const { url, format, size, width, height, publicId } = await uploadImageByUrl(
                generatedImageUrl,
                progressEvent => onProgress(progressEvent, 50),
            );

            const image: ImageBasic = {
                userId,
                originalUrl: url,
                publicId,
                size,
                format,
                width,
                height,
            };
            const response = await createImage(image, progressEvent =>
                onProgress(progressEvent, 100),
            );

            console.log(response);
            const newImage: GeneratedImage = {
                id: Date.now().toString(),
                url: response.originalUrl,
                prompt: prompt,
                createdAt: new Date().toISOString(),
            };

            setGeneratedImage(newImage);
            setGenerationHistory(prev => [newImage, ...prev]);
            toast.success('Image generated successfully');
        } catch (error) {
            console.error('Error generating image:', error);
            toast.error('Failed to generate image');
        } finally {
            setIsGenerating(false);
            setProgress(0);
        }
    };

    const handleEnhancePrompt = async () => {
        if (!prompt.trim()) {
            toast.warning('Please enter a prompt to enhance.');
            return;
        }

        setIsEnhancingPrompt(true);
        try {
            const {
                data: { prompt: enhancedText },
            } = await AIGenerateText(prompt, 100);

            setPrompt(enhancedText);
            toast.success('Prompt enhanced!');
        } catch (error) {
            console.error('Error enhancing prompt:', error);
            toast.error('Failed to enhance prompt.');
        } finally {
            setIsEnhancingPrompt(false);
        }
    };

    return (
        <div className="grid gap-8 lg:grid-cols-2">
            {/* Prompt Input */}
            <Card className="p-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="model">Model</Label>
                        <Select
                            value={selectedModel}
                            onValueChange={setSelectedModel}
                            disabled={isGenerating || isEnhancingPrompt}
                        >
                            <SelectTrigger id="model">
                                <SelectValue placeholder="Select a model" />
                            </SelectTrigger>
                            <SelectContent>
                                {MODELS.map(model => (
                                    <SelectItem key={model.id} value={model.id}>
                                        <div className="flex flex-col">
                                            <span>{model.name}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedModel === 'fluxPro' && (
                        <div className="space-y-2">
                            <Label htmlFor="server" className="text-nowrap">
                                Server Choice
                                {isMobile ? (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                size="icon"
                                                variant={'ghost'}
                                                title="switch between servers if one is slow or fails:"
                                            >
                                                <Info />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-80">
                                            <p className="text-sm">
                                                Switch between servers if one is slow or fails
                                            </p>
                                        </PopoverContent>
                                    </Popover>
                                ) : (
                                    <span className="text-sm text-gray-300">
                                        - Switch between servers if one is slow or fails:
                                    </span>
                                )}
                            </Label>
                            <Select
                                value={selectedServer}
                                onValueChange={setSelectedServer}
                                disabled={isGenerating}
                            >
                                <SelectTrigger id="server">
                                    <SelectValue placeholder="Select a server" />
                                </SelectTrigger>
                                <SelectContent>
                                    {SERVER_CHOICES.map(server => (
                                        <SelectItem key={server.id} value={server.id}>
                                            {server.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="flex items-center justify-between">
                        <Label htmlFor="prompt">Prompt</Label>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleEnhancePrompt}
                            disabled={isGenerating || isEnhancingPrompt}
                            className="cursor-pointer gap-1 text-xs"
                        >
                            {isEnhancingPrompt ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                                <Sparkles className="h-3 w-3" />
                            )}
                            {isEnhancingPrompt ? 'Enhancing...' : 'Enhance Prompt'}
                        </Button>
                    </div>

                    <div>
                        <Textarea
                            id="prompt"
                            placeholder="Enter your prompt here..."
                            className="mt-2 min-h-[200px]"
                            value={prompt}
                            onChange={e => setPrompt(e.target.value)}
                            disabled={isGenerating || isEnhancingPrompt}
                        />
                    </div>

                    <div className="space-y-4">
                        <Button
                            variant="ghost"
                            className="w-full justify-between"
                            onClick={() => setShowAdvanced(!showAdvanced)}
                        >
                            <span>Advanced Options</span>
                            {showAdvanced ? (
                                <ChevronUp className="h-4 w-4" />
                            ) : (
                                <ChevronDown className="h-4 w-4" />
                            )}
                        </Button>

                        {showAdvanced && (
                            <div className="space-y-4 rounded-lg border p-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="width">Width</Label>
                                        <Input
                                            id="width"
                                            type="number"
                                            value={options.width}
                                            onChange={e =>
                                                setOptions(prev => ({
                                                    ...prev,
                                                    width: parseInt(e.target.value),
                                                }))
                                            }
                                            min={256}
                                            max={1024}
                                            step={64}
                                            disabled={isGenerating || isEnhancingPrompt}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="height">Height</Label>
                                        <Input
                                            id="height"
                                            type="number"
                                            value={options.height}
                                            onChange={e =>
                                                setOptions(prev => ({
                                                    ...prev,
                                                    height: parseInt(e.target.value),
                                                }))
                                            }
                                            min={256}
                                            max={1024}
                                            step={64}
                                            disabled={isGenerating || isEnhancingPrompt}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="guidanceScale">Guidance Scale</Label>
                                    <Slider
                                        id="guidanceScale"
                                        min={1}
                                        max={20}
                                        step={0.5}
                                        value={[options.guidanceScale || 7.5]}
                                        onValueChange={value =>
                                            setOptions(prev => ({
                                                ...prev,
                                                guidanceScale: value[0],
                                            }))
                                        }
                                        disabled={isGenerating || isEnhancingPrompt}
                                    />
                                    <div className="text-muted-foreground text-sm">
                                        {options.guidanceScale}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="numInferenceSteps">Inference Steps</Label>
                                    <Slider
                                        id="numInferenceSteps"
                                        min={20}
                                        max={100}
                                        step={1}
                                        value={[options.numInferenceSteps || 50]}
                                        onValueChange={value =>
                                            setOptions(prev => ({
                                                ...prev,
                                                numInferenceSteps: value[0],
                                            }))
                                        }
                                        disabled={isGenerating || isEnhancingPrompt}
                                    />
                                    <div className="text-muted-foreground text-sm">
                                        {options.numInferenceSteps}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <Label htmlFor="randomize">Randomize Seed</Label>
                                    <Switch
                                        id="randomize"
                                        checked={options.randomize}
                                        onCheckedChange={checked =>
                                            setOptions(prev => ({
                                                ...prev,
                                                randomize: checked,
                                            }))
                                        }
                                        disabled={isGenerating || isEnhancingPrompt}
                                    />
                                </div>

                                {!options.randomize && (
                                    <div className="space-y-2">
                                        <Label htmlFor="seed">Seed</Label>
                                        <Input
                                            id="seed"
                                            type="number"
                                            value={options.seed}
                                            onChange={e =>
                                                setOptions(prev => ({
                                                    ...prev,
                                                    seed: parseInt(e.target.value),
                                                }))
                                            }
                                            disabled={isGenerating || isEnhancingPrompt}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <Button
                        className="w-full"
                        onClick={handleGenerate}
                        disabled={isGenerating || isEnhancingPrompt || !prompt.trim()}
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Wand2 className="mr-2 h-4 w-4" />
                                Generate Image
                            </>
                        )}
                    </Button>

                    {isGenerating && (
                        <div className="space-y-2">
                            <div className="text-muted-foreground flex items-center justify-between text-sm">
                                <span>Generating image...</span>
                                <span>{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                        </div>
                    )}
                </div>
            </Card>

            {/* Image Preview */}
            <Card className="p-6">
                <h2 className="mb-4 text-lg font-semibold">Generated Image</h2>
                <div className="relative aspect-square w-full">
                    {generatedImage ? (
                        <Image
                            src={generatedImage.url}
                            alt="Generated image"
                            fill
                            className="rounded-lg object-contain"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    ) : (
                        <div className="text-muted-foreground flex h-full items-center justify-center rounded-lg border-2 border-dashed">
                            {isGenerating ? (
                                <div className="text-center">
                                    <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin" />
                                    <p>Generating your image...</p>
                                </div>
                            ) : (
                                <Image
                                    src="/dino.png"
                                    alt="Generated image"
                                    fill
                                    className="rounded-lg object-contain"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            )}
                        </div>
                    )}
                </div>

                {generationHistory.length > 0 && (
                    <div className="mt-6">
                        <h3 className="mb-4 text-lg font-semibold">Generation History</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {generationHistory.map(item => (
                                <div
                                    key={item.id}
                                    className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg"
                                    onClick={() => setGeneratedImage(item)}
                                >
                                    <Image
                                        src={item.url}
                                        alt="Generated version"
                                        fill
                                        className="aspect-square object-cover transition-transform group-hover:scale-105"
                                    />
                                    <div className="absolute right-0 bottom-0 left-0 bg-black/50 p-2 text-sm text-white">
                                        {item.prompt.length > 50
                                            ? `${item.prompt.substring(0, 50)}...`
                                            : item.prompt}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};
