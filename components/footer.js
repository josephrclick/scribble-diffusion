import Link from "next/link";
import Image from "next/image";
// import "react-tooltip/dist/react-tooltip.css";

export default function Footer() {
  return (
    <footer className="mt-20">
      <div className="p-8">
        <p className="text-center mb-2 text-sm">
          Another proof of concept built with LLMs.
        </p> 
        <p className="text-center text-sm mb-4"> 
          Based on Scribble Diffusion, an open-source project from{" "}
          <Link
            className="underline"
            href="https://replicate.com?utm_source=project&utm_campaign=scribblediffusion"
            target="_blank"
          >
            Replicate
          </Link>
          .
        </p>
      </div>
    </footer>
  );
}
