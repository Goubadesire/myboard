import MainLayout from "./components/mainLayout"
import Script from "next/script";


export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link href="https://cdn.jsdelivr.net/npm/daisyui@5" rel="stylesheet" type="text/css" />
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        <link href="https://cdn.jsdelivr.net/npm/daisyui@5/themes.css" rel="stylesheet" type="text/css" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-5JMF0QEWHK"></script>
         <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-5JMF0QEWHK"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-5JMF0QEWHK');
            `,
          }}
        />

      </head>
      <body>
          {children}
      </body>
    </html>
  )
}
