import MainLayout from "./components/mainLayout"


export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link href="https://cdn.jsdelivr.net/npm/daisyui@5" rel="stylesheet" type="text/css" />
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        <link href="https://cdn.jsdelivr.net/npm/daisyui@5/themes.css" rel="stylesheet" type="text/css" />
      </head>
      <body>
          {children}
      </body>
    </html>
  )
}
