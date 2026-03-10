import type { Auth } from '@/types/auth';

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            [key: string]: unknown;
        };
    }
}

declare global {
    function route(): string;
    function route(name: string, params?: Record<string, unknown> | number | string): string;
    function route(name: string, params?: Record<string, unknown> | number | string, absolute?: boolean): string;
    
    interface Window {
        route: typeof route;
    }
}
