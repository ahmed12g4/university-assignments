"use client";

import { Toast, ToastClose, ToastDescription, ToastTitle, ToastViewport } from "./toast";
import { useToast } from "./use-toast";

export function Toaster() {
    const { toasts } = useToast();

    return (
        <>
            {toasts.map(({ id, title, description, variant }) => (
                <Toast
                    key={id}
                    variant={variant}
                >
                    <div className="grid gap-1">
                        {title && <ToastTitle>{title}</ToastTitle>}
                        {description && <ToastDescription>{description}</ToastDescription>}
                    </div>
                    <ToastClose />
                </Toast>
            ))}
            <ToastViewport className="fixed inset-0 m-auto flex items-center justify-center" />
        </>
    );
}
