import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import Image from 'next/image';
import { TransformImage } from '@/types/image.type';

interface TransformHistoryProps {
    history: TransformImage[];
    onHistoryItemClick: (item: TransformImage) => void;
    onRemoveHistoryItem: (itemId: string, e: React.MouseEvent) => void;
}

export function TransformHistory({
    history,
    onHistoryItemClick,
    onRemoveHistoryItem,
}: TransformHistoryProps) {
    if (!history || history.length === 0) {
        return (
            <p className="text-muted-foreground text-center text-sm">No transform history yet</p>
        );
    }

    return (
        <div className="grid grid-cols-4 gap-2">
            {history.map(item => (
                <Card
                    key={item.id}
                    className="group relative aspect-square cursor-pointer overflow-hidden"
                    onClick={() => onHistoryItemClick(item)}
                >
                    <Image src={item.url} alt="History item" fill className="object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button
                            variant="destructive"
                            size="icon"
                            className="h-6 w-6"
                            onClick={e => onRemoveHistoryItem(item.id, e)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
    );
}
