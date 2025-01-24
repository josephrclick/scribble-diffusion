import { Html, Head, Main, NextScript } from "next/document";

import pkg from "../package.json";
import Footer from "components/footer";

export default function Document() {
  return (
    <Html>
      <Head>
        
      </Head>

      <body className="bg-gray-100">
        <Main />
        <Footer />
        <NextScript />
        <style jsx global>{`
          @media screen and (max-width: 768px) {
            .react-sketch-canvas {
              touch-action: none;
              max-width: 100vw;
              width: 100vw !important;
              height: 100vw !important;
            }
          }
        `}</style>
      </body>
    </Html>
  );
}