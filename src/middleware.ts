import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // 라우트 분류
  const isAuthRoute = pathname === '/auth' || pathname.startsWith('/auth/');
  const isOnboardingRoute = pathname === '/onboarding';
  const isProtectedRoute = pathname.startsWith('/dashboard');
  const isLegacyAuthRoute = pathname === '/login' || pathname === '/register';

  // 레거시 로그인/회원가입 경로 → /auth로 리다이렉트
  if (isLegacyAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth';
    return NextResponse.redirect(url);
  }

  // 비로그인 사용자
  if (!user) {
    // 보호된 라우트 접근 시 → 로그인으로
    if (isProtectedRoute || isOnboardingRoute) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth';
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  // 로그인 사용자
  const hasCompletedOnboarding = user.user_metadata?.onboarding_completed;

  // 로그인 사용자가 auth 페이지 접근 시
  if (isAuthRoute && !pathname.includes('/callback')) {
    const url = request.nextUrl.clone();
    url.pathname = hasCompletedOnboarding ? '/dashboard' : '/onboarding';
    return NextResponse.redirect(url);
  }

  // 온보딩 미완료 사용자가 대시보드 접근 시 → 온보딩으로
  if (!hasCompletedOnboarding && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/onboarding';
    return NextResponse.redirect(url);
  }

  // 온보딩 완료 사용자가 온보딩 페이지 접근 시 → 대시보드로
  if (hasCompletedOnboarding && isOnboardingRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth', '/auth/:path*', '/onboarding', '/login', '/register'],
};
