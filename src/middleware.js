import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  const protectedPaths = [
    "/my-meetings",
    "/chat",
    "/account-settings",
    "/profile-edit",
    "/subscription",
    "/feed",
    "/get-quote",
    "/air-tracking",
    "/container-tracking",
    "/freight-index",
  ];
  const authPaths = ["/sign-in", "/sign-up", "/forgot-password"];
  const pathname = request.nextUrl.pathname;

  // Eğer kullanıcı zaten login olmuşsa ve sign-in/sign-up sayfalarına geliyorsa
  if (authPaths.some((path) => pathname.startsWith(path))) {
    const userStatus = await checkUser(request);
    if (userStatus) {
      console.log("User already logged in, redirecting to main page.");
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    const userStatus = await checkUser(request);
    if (!userStatus) {
      console.log("No token found, redirecting to /sign-in");
      const redirectUrl = new URL("/sign-in", request.url);
      redirectUrl.searchParams.set(
        "redirect",
        pathname + request.nextUrl.search,
      );
      return NextResponse.redirect(redirectUrl);
    }
  } else if (pathname.startsWith("/api")) {
    const userStatus = await checkUser(request);
    if (!userStatus) {
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized" }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

async function checkUser(request) {
  const token = request.cookies.get("accessToken");
  const sessionId = request.cookies.get("sessionId");

  const verified = await verifyToken(token?.value);
  return token && sessionId && verified;
}

const verifyToken = async (token) => {
  if (!token) return null;

  try {
    const securityKey = process.env.SECURITY_KEY;
    const keyUint8Array = new TextEncoder().encode(securityKey); // Convert to Uint8Array
    // 10 saniye tolerans ekle (nbf kontrol hatası için)
    const decoded = await jwtVerify(token, keyUint8Array, {
      clockTolerance: 10, // 10 saniye tolerans
    });

    const currentTime = Date.now() / 1000;
    if (decoded.payload.exp < currentTime) {
      console.log("Token has expired !");
      return false;
    }

    return decoded.payload?.id ? true : false;
  } catch (error) {
    console.log("catch", error);
    return null;
  }
};

export const config = {
  matcher: [
    "/sign-in",
    "/sign-up",
    "/chat/:path*",
    "/global-networkers/:path*",
    "/my-meetings/:path*",
    "/account-settings/:path*",
    "/profile-edit/:path*",
    "/subscription/:path*",
    "/api/:path*",
    "/feed/:path*",
    "/get-quote/:path",
    "/air-tracking",
    "/container-tracking",
    "/freight-index",
  ],
};
