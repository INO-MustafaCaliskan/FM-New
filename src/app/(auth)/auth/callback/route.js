// app/auth/callback/route.js
import { NextResponse } from 'next/server';
import { SignInOAuth } from '@/utils/authActions';

async function handleOAuthCallback(code, rawState, requestUrl, idToken = null, appleUser = null) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!code || !rawState) {
        return NextResponse.redirect(new URL('/sign-in?error=oauth_failed', baseUrl));
    }

    let state;
    try {
        state = JSON.parse(rawState);
    } catch {
        return NextResponse.redirect(new URL('/sign-in?error=oauth_failed', baseUrl));
    }

    const timeZone = state.timeZone ?? 'UTC';

    const safeRedirect = (path) => {
        try {
            const url = new URL(path, requestUrl);
            if (url.origin === new URL(requestUrl).origin) {
                return url.pathname + url.search;
            }
        } catch {}
        return '/global-networkers';
    };

    const result = await SignInOAuth({
        code,
        timeZone,
        referralCode : state.referralCode,
        provider: state.provider,
        idToken, // Apple ayrıca id_token dönüyor
        appleUser, // İlk girişte gelen user objesi (içinde isim soyisim var)
    });

    if (result.success) {
        return NextResponse.redirect(new URL(safeRedirect(state.redirect), baseUrl));
    }

    return NextResponse.redirect(new URL('/sign-in?error=oauth_failed', baseUrl));
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const rawState = searchParams.get('state');
    
    return handleOAuthCallback(code, rawState, request.url);
}

export async function POST(request) {
    const formData = await request.formData();
    const code = formData.get('code');
    const rawState = formData.get('state');
    const idToken = formData.get('id_token');
    
    // Apple, "user" bilgisini string (JSON) olarak sadece POST isteğiyle ve SADECE İLK girişte gönderir.
    const userString = formData.get('user');
    let appleUser = null;
    if (userString) {
        try {
            appleUser = JSON.parse(userString);
        } catch (e) {
            console.error("Apple user parse error:", e);
        }
    }

    return handleOAuthCallback(code, rawState, request.url, idToken, appleUser);
}