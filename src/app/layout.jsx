import { GoogleTagManager } from '@next/third-parties/google';
import { cookies } from 'next/headers';
import Providers from 'src/lib/providers';

// This layout reads request cookies; mark intentionally dynamic so Next.js
// doesn't warn about pages changing from static to dynamic at runtime.
export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }) {
  const cookiesList = cookies();
  const hasCookie = cookiesList.get('token');

  return (
    <html lang={'en-US'}>
      <GoogleTagManager gtmId="GTM-MKV8TXN5" />
      <body>
        <Providers isAuth={hasCookie}>{children}</Providers>
      </body>
    </html>
  );
}
