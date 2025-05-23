export type BaseResponse<T> = {
    status: string;
    statusCode: number;
    message: string;
    data: T;
};

export type GenerateResponse = {
    success: boolean;
    data: {
        generatedImageUrl: string;
    };
};

export type RemoveBackgroundResponse = {
    success: boolean;
    data: {
        processedImageUrl: string;
    };
};
