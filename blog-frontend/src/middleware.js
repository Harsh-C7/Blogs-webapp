import { NextResponse } from 'next/server';

export function middleware(request) {
    const { pathname } = request.nextUrl;

    const token = request.cookies.get('token')?.value || request.headers.get('Authorization')?.split(' ')[1];

    const publicPaths = ['/'];
    const isPublicPath = publicPaths.some(path => pathname === path);

    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (pathname === '/logout') {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('token');
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/dashboard', '/signup', '/logout'],
};