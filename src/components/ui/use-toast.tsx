import * as React from 'react';

type ToastProps = {
    title?: string;
    description?: string;
    variant?: 'default' | 'destructive';
};

type ToastContextType = {
    toast: (props: ToastProps) => void;
};

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = React.useState<ToastProps[]>([]);

    const toast = React.useCallback((props: ToastProps) => {
        setToasts(prev => [...prev, props]);
        setTimeout(() => {
            setToasts(prev => prev.slice(1));
        }, 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className="fixed right-0 bottom-0 z-50 m-4 flex flex-col gap-2">
                {toasts.map((t, i) => (
                    <div
                        key={i}
                        className={`rounded-lg p-4 shadow-lg ${
                            t.variant === 'destructive'
                                ? 'bg-destructive text-destructive-foreground'
                                : 'bg-background text-foreground'
                        }`}
                    >
                        {t.title && <div className="font-semibold">{t.title}</div>}
                        {t.description && <div className="text-sm">{t.description}</div>}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = React.useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
