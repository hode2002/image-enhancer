export type ImageBasic = {
    userId: string;
    originalUrl: string;
    publicId: string;
    size: number;
    format: string;
    width: number;
    height: number;
};

export type ImageFull = {
    id: string;
    userId: string;
    originalUrl: string;
    publicId: string;
    size: number;
    format: string;
    width: number;
    height: number;
    createdAt: string;
    updatedAt: string;
};

export type TransformOptions = {
    w?: number;
    h?: number;
    format: 'jpeg' | 'png' | 'webp' | 'avif';
    fit: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
    quality: number;
    grayscale: boolean;
    blur: number;
    sharpen: boolean;
    rotate: number;
    crop?: {
        left: number;
        top: number;
        width: number;
        height: number;
    };
    enhance: '2x' | '4x' | '8x';
};

export type TransformImage = {
    id: string;
    imageId: string;
    publicId: string;
    url: string;
    width?: number;
    height?: number;
    format: 'jpeg' | 'png' | 'webp' | 'avif';
    fit: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
    quality: number;
    grayscale: boolean;
    blur: number;
    sharpen: number;
    rotate: number;
    crop?: {
        left: number;
        top: number;
        width: number;
        height: number;
    };
    enhance: '2x' | '4x' | '8x';
    options: string;
    createdAt: string;
};
