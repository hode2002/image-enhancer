import { TransformOptions } from '@/types/image.type';
import { TransformQuery } from '@/types/query.type,';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const convertToQueryString = (query: TransformQuery): string => {
    const params = new URLSearchParams();

    if (query.w) params.append('w', query.w.toString());
    if (query.h) params.append('h', query.h.toString());
    if (query.format) params.append('format', query.format);
    if (query.fit) params.append('fit', query.fit);
    if (query.quality) params.append('quality', query.quality.toString());
    if (query.grayscale) params.append('grayscale', query.grayscale.toString());
    if (query.blur) params.append('blur', query.blur.toString());
    if (query.sharpen) params.append('sharpen', query.sharpen.toString());
    if (query.rotate) params.append('rotate', query.rotate.toString());
    if (query.enhance) params.append('enhance', query.enhance.toString());

    if (query.crop) {
        params.append('crop.left', query.crop.left.toString());
        params.append('crop.top', query.crop.top.toString());
        params.append('crop.width', query.crop.width.toString());
        params.append('crop.height', query.crop.height.toString());
    }

    const queryString = params.toString();
    return queryString ? `?${queryString}` : '';
};

export const convertQueryToTransformOption = (query: string): TransformOptions => {
    const params = new URLSearchParams(query);

    const options: TransformOptions = {
        w: params.get('w') ? parseInt(params.get('width')!) : undefined,
        h: params.get('h') ? parseInt(params.get('height')!) : undefined,
        format: (params.get('format') as TransformOptions['format']) || 'jpeg',
        fit: (params.get('fit') as TransformOptions['fit']) || 'cover',
        quality: params.get('quality') ? parseInt(params.get('quality')!) : 80,
        grayscale: params.get('grayscale') === 'true',
        blur: params.get('blur') ? parseInt(params.get('blur')!) : 0,
        sharpen: params.get('sharpen') === 'true',
        rotate: params.get('rotate') ? parseInt(params.get('rotate')!) : 0,
        enhance: params.get('enhance') === 'true',
    };

    const cropLeft = params.get('crop.left');
    const cropTop = params.get('crop.top');
    const cropWidth = params.get('crop.width');
    const cropHeight = params.get('crop.height');

    if (cropLeft || cropTop || cropWidth || cropHeight) {
        options.crop = {
            left: cropLeft ? parseInt(cropLeft) : 0,
            top: cropTop ? parseInt(cropTop) : 0,
            width: cropWidth ? parseInt(cropWidth) : 0,
            height: cropHeight ? parseInt(cropHeight) : 0,
        };
    }

    return options;
};
