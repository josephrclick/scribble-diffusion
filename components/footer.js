import Link from "next/link";
import Image from "next/image";
// import "react-tooltip/dist/react-tooltip.css";

export default function Footer() {
  return (
    <footer className="mt-20">
      <div className="p-4">
      <div className="flex items-center">
        <Image
              src="/jrc.jpg"
              alt="The man, the myth, the legend."
              width={64}
              height={64}
              className="w-16 h-16 mr-4"
          />
          <div>
        <p className="mb-4 text-sm">
          Another proof of concept built with LLMs.
        </p> 
        <p className="text-sm"> 
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
      </div>
      </div>
    </footer>
  );
}
