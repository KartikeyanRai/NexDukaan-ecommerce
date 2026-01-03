// import { NextResponse } from 'next/server';

// export function middleware(req) {
//   const token = req.cookies.get('token')?.value;
//   const role = req.cookies.get('role')?.value;
//   const { pathname } = req.nextUrl;

//   // Protect Admin Dashboard
//   if (pathname.startsWith('/dashboard')) {
//     if (!token || role !== 'admin') {
//       return NextResponse.redirect(new URL('/login', req.url));
//     }
//   }

//   // Protect Shop
//   if (pathname.startsWith('/shop')) {
//     if (!token) {
//       return NextResponse.redirect(new URL('/login', req.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/dashboard/:path*', '/shop/:path*'],
// };

import { NextResponse } from 'next/server';

export function middleware(req) {
  const token = req.cookies.get('token')?.value;
  const role = req.cookies.get('role')?.value;
  const { pathname } = req.nextUrl;

  // ---------------------------------------------------------
  // 1. Protect Admin Dashboard
  // ---------------------------------------------------------
  if (pathname.startsWith('/dashboard')) {
    
    // Case A: User is NOT logged in (No token)
    // ACTION: Redirect to SIGNUP (as requested)
    if (!token) {
      return NextResponse.redirect(new URL('/signup', req.url));
    }

    // Case B: User IS logged in, but is NOT an admin (e.g., a Client)
    // ACTION: Redirect them to the Shop page (User Experience improvement)
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/shop', req.url));
    }
  }

  // ---------------------------------------------------------
  // 2. Protect Shop (Client Area)
  // ---------------------------------------------------------
  if (pathname.startsWith('/shop')) {
    // If not logged in, send to Login (Standard behavior for shoppers)
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/shop/:path*'],
};