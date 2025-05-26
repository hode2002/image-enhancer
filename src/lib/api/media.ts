import { httpClient } from '@/lib/http/client';
import { BaseResponse } from '@/types/http.type';
import { UploadResponse } from '@/types/upload.type';
import { AxiosProgressEvent } from 'axios';

export const uploadImage = async (
    file: File,
    onProgress?: (progressEvent: AxiosProgressEvent) => void,
): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await httpClient.post<BaseResponse<UploadResponse>>(
        '/media/upload',
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: onProgress,
        },
    );

    return response.data.data;
};

export const uploadImageByUrl = async (
    imageUrl: string,
    onProgress?: (progressEvent: AxiosProgressEvent) => void,
): Promise<UploadResponse> => {
    const response = await httpClient.post<BaseResponse<UploadResponse>>(
        '/media/upload-url',
        { imageUrl },
        {
            onUploadProgress: onProgress,
        },
    );

    return response.data.data;
};
