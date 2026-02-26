"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            // Block F12
            if (e.key === "F12") {
                e.preventDefault();
            }
            // Block Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
            if (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) {
                e.preventDefault();
            }
            // Block Cmd+Option+I, Cmd+Option+J, Cmd+Option+C (Mac)
            if (e.metaKey && e.altKey && (e.key === "i" || e.key === "j" || e.key === "c")) {
                e.preventDefault();
            }
            // Block Ctrl+U or Cmd+U (View Source)
            if ((e.ctrlKey || e.metaKey) && e.key === "u") {
                e.preventDefault();
            }
        };

        window.addEventListener("contextmenu", handleContextMenu);
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("contextmenu", handleContextMenu);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return <SessionProvider>{children}</SessionProvider>;
}
