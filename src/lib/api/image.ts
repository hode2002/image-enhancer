import { httpClient } from '@/lib/http/client';
import { convertToQueryString } from '@/lib/utils';
import { BaseResponse, GenerateResponse, RemoveBackgroundResponse } from '@/types/http.type';
import { AIGenerateOptions, ImageBasic, ImageFull, TransformImage } from '@/types/image.type';
import { TransformQuery } from '@/types/query.type,';
import axios, { AxiosProgressEvent } from 'axios';

const prefix = '/images';

export const createImage = async (
    image: ImageBasic,
    onProgress?: (progressEvent: AxiosProgressEvent) => void,
): Promise<ImageFull> => {
    const response = await httpClient.post<BaseResponse<ImageFull>>(prefix, image, {
        onUploadProgress: onProgress,
    });

    return response.data.data;
};

export const getImageById = async (id: string): Promise<ImageFull> => {
    const response = await httpClient.get<BaseResponse<ImageFull>>(`${prefix}/${id}`);
    return response.data.data;
};

export const getTransformedImage = async (id: string): Promise<TransformImage[]> => {
    const response = await httpClient.get<BaseResponse<TransformImage[]>>(
        `${prefix}/${id}/transformed`,
    );
    return response.data.data;
};

export const transformImage = async (
    id: string,
    query: TransformQuery,
    onProgress?: (progressEvent: AxiosProgressEvent) => void,
): Promise<TransformImage> => {
    const queryString = convertToQueryString(query);
    const response = await httpClient.get<BaseResponse<TransformImage>>(
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
    const response = await httpClient.get<BaseResponse<ImageFull[]>>(`${prefix}/user`, {
        onUploadProgress: onProgress,
    });

    return response.data.data;
};

export const AIGenerate = async (
    model: string,
    options: AIGenerateOptions,
    onProgress?: (progressEvent: AxiosProgressEvent) => void,
): Promise<GenerateResponse> => {
    const response = await axios.post<GenerateResponse>(
        `${process.env.NEXT_PUBLIC_AI_API_URL}/generate?model=${model}`,
        options,
        {
            onUploadProgress: onProgress,
        },
    );

    return response.data;
};

export const AIRemoveBackground = async (
    imageUrl: string,
    onProgress?: (progressEvent: AxiosProgressEvent) => void,
): Promise<RemoveBackgroundResponse> => {
    const response = await axios.post<RemoveBackgroundResponse>(
        `${process.env.NEXT_PUBLIC_AI_API_URL}/remove-background`,
        { imageUrl },
        {
            onUploadProgress: onProgress,
        },
    );

    return response.data;
};

export const deleteImage = async (
    imageId: string,
    onProgress?: (progressEvent: AxiosProgressEvent) => void,
): Promise<ImageFull> => {
    const response = await httpClient.delete<BaseResponse<ImageFull>>(`${prefix}/${imageId}`, {
        onUploadProgress: onProgress,
    });

    return response.data.data;
};
