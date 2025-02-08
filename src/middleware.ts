/* eslint-disable @typescript-eslint/no-unused-vars */
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { jwtDecode } from "jwt-decode";

// interface DecodedToken {
//   role: "admin" | "user";
// }

// export function middleware(request: NextRequest) {
//   const protectedPaths = ["/dashboard", "/profile", "/detail-product", "/user"];

//   const authPaths = ["/auth/login", "/auth/register"];

//   const currentPath = request.nextUrl.pathname;

//   const isProtectedPath = protectedPaths.some((path) =>
//     currentPath.startsWith(path)
//   );

//   const isAuthPath = authPaths.some((path) => currentPath.startsWith(path));

//   const token = request.cookies.get("token");

//   if (isProtectedPath && !token) {
//     const loginUrl = new URL("/auth/login", request.url);
//     loginUrl.searchParams.set("callbackUrl", currentPath);
//     return NextResponse.redirect(loginUrl);
//   }

//   if (isAuthPath && token) {
//     try {
//       const decodedToken = jwtDecode<DecodedToken>(token.value);
//       const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");

//       if (callbackUrl) {
//         const isAdminPath = callbackUrl.startsWith("/dashboard");

//         if (decodedToken.role === "admin") {
//           return NextResponse.redirect(new URL(callbackUrl, request.url));
//         } else if (decodedToken.role === "user" && !isAdminPath) {
//           return NextResponse.redirect(new URL(callbackUrl, request.url));
//         }
//       }

//       if (decodedToken.role === "admin") {
//         return NextResponse.redirect(new URL("/dashboard", request.url));
//       }

//       return NextResponse.redirect(new URL("/", request.url));
//     } catch (error) {
//       return NextResponse.next();
//     }
//   }

//   if (isProtectedPath && token) {
//     try {
//       const decodedToken = jwtDecode<DecodedToken>(token.value);

//       if (
//         decodedToken.role !== "admin" &&
//         currentPath.startsWith("/dashboard")
//       ) {
//         return NextResponse.redirect(new URL("/", request.url));
//       }

//       return NextResponse.next();
//     } catch (error) {
//       const loginUrl = new URL("/auth/login", request.url);
//       loginUrl.searchParams.set("callbackUrl", currentPath);
//       return NextResponse.redirect(loginUrl);
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/dashboard/:path*",
//     "/profile/:path*",
//     "/auth/:path*",
//     "/user/:path*",
//     "/detail-product/:path*",
//     "/detail-profile/:path*",
//   ],
// };

/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  role: "admin" | "user";
  isActive: number; // Tambahkan properti isActive
}

export function middleware(request: NextRequest) {
  const protectedPaths = ["/dashboard", "/profile", "/detail-product", "/user"];
  const authPaths = ["/auth/login", "/auth/register"];
  const currentPath = request.nextUrl.pathname;

  const isProtectedPath = protectedPaths.some((path) =>
    currentPath.startsWith(path)
  );

  const isAuthPath = authPaths.some((path) => currentPath.startsWith(path));

  const token = request.cookies.get("token");

  // Redirect ke login jika mengakses protected path tanpa token
  if (isProtectedPath && !token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", currentPath);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect jika sudah login tapi mengakses auth path
  if (isAuthPath && token) {
    try {
      const decodedToken = jwtDecode<DecodedToken>(token.value);
      const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");

      // Tambahkan pengecekan isActive
      if (decodedToken.isActive === 0) {
        return NextResponse.redirect(new URL("/inactive-account", request.url));
      }

      if (callbackUrl) {
        const isAdminPath = callbackUrl.startsWith("/dashboard");
        if (decodedToken.role === "admin") {
          return NextResponse.redirect(new URL(callbackUrl, request.url));
        } else if (decodedToken.role === "user" && !isAdminPath) {
          return NextResponse.redirect(new URL(callbackUrl, request.url));
        }
      }

      if (decodedToken.role === "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      return NextResponse.redirect(new URL("/", request.url));
    } catch (error) {
      return NextResponse.next();
    }
  }

  // Handle proteksi path dengan token valid
  if (isProtectedPath && token) {
    try {
      const decodedToken = jwtDecode<DecodedToken>(token.value);

      // Pengecekan status isActive
      if (decodedToken.isActive === 0) {
        return NextResponse.redirect(new URL("/inactive-account", request.url));
      }

      // Pengecekan role untuk admin dashboard
      if (
        decodedToken.role !== "admin" &&
        currentPath.startsWith("/dashboard")
      ) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      return NextResponse.next();
    } catch (error) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("callbackUrl", currentPath);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/auth/:path*",
    "/user/:path*",
    "/detail-product/:path*",
    "/detail-profile/:path*",
    "/inactive-account", // Tambahkan ini jika ingin memproteksi halaman inactive
  ],
};
