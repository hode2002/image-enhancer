import { TextGeneratorResponse } from '@/types/text-generator.type';
import axios, { AxiosProgressEvent } from 'axios';

export const AIGenerateText = async (
    prompt: string,
    maxLength: number = 200,
    onProgress?: (progressEvent: AxiosProgressEvent) => void,
): Promise<TextGeneratorResponse> => {
    const response = await axios.post<TextGeneratorResponse>(
        `${process.env.NEXT_PUBLIC_AI_API_URL}/text`,
        {
            prompt,
            maxLength,
        },
        {
            onUploadProgress: onProgress,
        },
    );

    return response.data;
};
