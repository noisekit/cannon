'use client';

import { Analytics } from '@vercel/analytics/react';
import { ColorModeScript } from '@chakra-ui/react';
import createEmotionServer from '@emotion/server/create-instance';
import Document, {
  DocumentContext,
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document';

import emotionCache from '@/lib/emotion-cache';

import { GoogleAnalytics } from '@next/third-parties/google';

const { extractCritical } = createEmotionServer(emotionCache);

export default class CustomDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    const styles = extractCritical(initialProps.html);
    return {
      ...initialProps,
      styles: [
        initialProps.styles,
        <style
          key="emotion-css"
          dangerouslySetInnerHTML={{ __html: styles.css }}
          data-emotion-css={styles.ids.join(' ')}
        />,
      ],
    };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <style>{`
            body.fouc-prevention {
              background-color: rgb(14, 17, 22);
            }
            body.fouc-prevention * {
              display: none !important;
            }
          `}</style>
          <link rel="icon" href="/favicon.ico" sizes="any" />
        </Head>
        <body className="fouc-prevention">
          <ColorModeScript />
          <Main />
          <NextScript />
          <Analytics />
        </body>
        <GoogleAnalytics gaId="G-C96791F6NC" />
      </Html>
    );
  }
}
