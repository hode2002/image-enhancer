export type TransformQuery = {
    w?: number;
    h?: number;
    format?: 'jpeg' | 'png' | 'webp' | 'avif';
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
    quality?: number;
    grayscale?: boolean;
    blur?: number;
    sharpen?: boolean;
    rotate?: number;
    crop?: {
        left: number;
        top: number;
        width: number;
        height: number;
    };
    enhance?: boolean;
};
