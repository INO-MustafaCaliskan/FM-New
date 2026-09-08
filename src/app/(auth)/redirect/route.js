import { jwtVerify } from "jose";

export async function GET(request) {
    const params = new URL(request.url).searchParams;
    const accessToken = params.get("a");
    const sessionId = params.get("s");
    const redirectUrl = params.get("r");

    if (!accessToken || !sessionId) {
        console.warn("Missing accessToken or sessionId in query parameters. Redirecting to sign-in page.");
        const signInTarget = `/sign-in?redirect=${encodeURIComponent(redirectUrl || "/global-networkers")}`;
        return new Response(null, {
            status: 307,
            headers: { Location: signInTarget },
        });
    }

    const isValid = await verifyToken(accessToken);
    if (!isValid) {
        console.warn("Invalid or expired accessToken. Redirecting to sign-in page.");
        const signInTarget = `/sign-in?redirect=${encodeURIComponent(redirectUrl || "/global-networkers")}`;
        return new Response(null, {
            status: 307,
            headers: { Location: signInTarget },
        });
    }

    const targetPath = redirectUrl || "/global-networkers";

    const headers = new Headers();
    const cookieOptions = { 
      path: "/", 
      sameSite: "Lax", 
      httpOnly : false, 
      secure : process.env.NODE_ENV === "production"
    }
    
    headers.set("Location", targetPath);
    headers.append("Set-Cookie", serializeCookie("accessToken", accessToken, cookieOptions));
    headers.append("Set-Cookie", serializeCookie("sessionId", sessionId, cookieOptions));

    return new Response(null, { status: 307, headers });
}

function serializeCookie(name, value, options = {}) {
    let cookie = `${name}=${encodeURIComponent(value)}`;
    if (options.path) cookie += `; Path=${options.path}`;
    if (options.maxAge !== undefined) cookie += `; Max-Age=${options.maxAge}`;
    if (options.httpOnly) cookie += `; HttpOnly`;
    if (options.sameSite) cookie += `; SameSite=${options.sameSite}`;
    if (options.secure) cookie += `; Secure`;
    return cookie;
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
    return false;
  }
};