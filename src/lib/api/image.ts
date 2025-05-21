import http from '@/lib/http';
import { convertToQueryString } from '@/lib/utils';
import { BaseResponse } from '@/types/http.type';
import { ImageBasic, ImageFull, TransformImage } from '@/types/image.type';
import { TransformQuery } from '@/types/query.type,';
import { AxiosProgressEvent } from 'axios';

const prefix = '/images';

export const createImage = async (
    image: ImageBasic,
    onProgress?: (progressEvent: AxiosProgressEvent) => void,
): Promise<ImageFull> => {
    const response = await http.post<BaseResponse<ImageFull>>(prefix, image, {
        onUploadProgress: onProgress,
    });

    return response.data.data;
};

export const getImageById = async (id: string): Promise<ImageFull> => {
    const response = await http.get<BaseResponse<ImageFull>>(`${prefix}/${id}`);
    return response.data.data;
};

export const getTransformedImage = async (id: string): Promise<TransformImage[]> => {
    const response = await http.get<BaseResponse<TransformImage[]>>(`${prefix}/${id}/transformed`);
    return response.data.data;
};

export const transformImage = async (
    id: string,
    query: TransformQuery,
    onProgress?: (progressEvent: AxiosProgressEvent) => void,
): Promise<TransformImage> => {
    const queryString = convertToQueryString(query);
    const response = await http.get<BaseResponse<TransformImage>>(
        `${prefix}/transform/${id}${queryString}`,
        {
            onUploadProgress: onProgress,
        },
    );

    return response.data.data;
};

export const getUserImage = async (
    onProgress?: (progressEvent: AxiosProgressEvent) => void,
): Promise<ImageFull[]> => {
    const response = await http.get<BaseResponse<ImageFull[]>>(`${prefix}/user`, {
        onUploadProgress: onProgress,
    });

    return response.data.data;
};
