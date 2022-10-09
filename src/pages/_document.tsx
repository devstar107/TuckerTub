import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en-AU">
        <Head>
          <link rel="preconnect" href="https://use.typekit.net" crossOrigin />
          <link rel="preconnect" href="https://p.typekit.net" crossOrigin />
          <link rel="preload" href="https://use.typekit.net/umo3ziv.css" as="style" />
          <link rel="stylesheet" href="https://use.typekit.net/umo3ziv.css" />
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="icon" href="/icon.svg" type="image/svg+xml" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/manifest.webmanifest" />

          {/* <meta
            name="google-site-verification"
            content="OnTeVV2U"
          /> */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
