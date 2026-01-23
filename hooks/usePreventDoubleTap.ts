import { useRef, useCallback } from "react";

const DEBOUNCE_MS = 600;

export function usePreventDoubleTap<T extends (...args: any[]) => any>(
    callback: T
): T {
    const lastTapTime = useRef(0);

    return useCallback(
        ((...args: Parameters<T>) => {
            const now = Date.now();
            if (now - lastTapTime.current < DEBOUNCE_MS) {
                return;
            }
            lastTapTime.current = now;
            return callback(...args);
        }) as T,
        [callback]
    );
}
