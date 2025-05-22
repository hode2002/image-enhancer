import type { Metadata } from 'next';

export const generateMetadata = async (): Promise<Metadata> => {
    return {
        title: 'Upload',
        description: 'Upload your image',
    };
};

export default function UploadLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
