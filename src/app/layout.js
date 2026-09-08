// app/layout.js (SERVER)

import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";
import { Inter, Noto_Color_Emoji } from "next/font/google";
import { UserProvider } from "@/context/UserContext";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

config.autoAddCss = false;

const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "600", "700"],
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Arial", "sans-serif"],
  variable: "--font-inter",
});

// const notoColorEmoji = Noto_Color_Emoji({
//   weight: '400',
//   display: 'swap',
//   subsets: ['emoji'],
//   variable: '--font-noto-color-emoji'
// })

export const metadata = {
  title: {
    template: "%s | Freight Talk",
    default: "Global Business Networking Platform | Freight Talk",
  },
  alternates: {
    canonical: "./",
  },
  description:
    "Join a global business networking platform to connect, collaborate and grow your professional network with trusted companies worldwide",
  metadataBase: new URL("https://freighttalk.com"),
  verification: {
    yandex: "dd5ccf6d8419f34f",
  },
};

export default function RootLayout({ children }) {
  const isProduction = process.env.NODE_ENV === "production";

  return (
    <html lang="en" className={inter.variable}>
      <body>
          {isProduction && (
            <>
              <GoogleTagManager gtmId="GTM-NJ9V52WB" />
              <GoogleAnalytics gaId="G-RKW62E5NPV" />
            </>
          )}
          <ToastContainer autoClose={2000} />
          <UserProvider>
            {children}
          </UserProvider>
      </body>
    </html>
  );
}
