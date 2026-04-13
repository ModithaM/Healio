'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

type ProtectedRouteProps = {
    children: ReactNode;
    requiredRole?: string;
};

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
    const router = useRouter();
    const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
    const isInitialized = useAuthStore((s) => s.isInitialized);
    const user = useAuthStore((s) => s.user);
    const userRole = user?.role;
    const isAdmin = userRole === 'ADMIN';
    const isAllowed = Boolean(
        isInitialized &&
        isLoggedIn &&
        (!requiredRole || isAdmin || userRole === requiredRole)
    );

    useEffect(() => {
        if (!isInitialized) return;

        if (!isLoggedIn) {
            console.log('not logged in');
            router.replace('/signin');
            return;
        }

        if (
            requiredRole &&
            !isAdmin && // Admin can access anything
            userRole !== requiredRole // role mismatch
        ) {
            router.replace('/unauthorized');
        }
    }, [isLoggedIn, userRole, isAdmin, requiredRole, router, isInitialized]);

    if (!isInitialized) return null; // or a spinner
    if (!isAllowed) return null; // loading fallback or spinner

    return <>{children}</>;
}
