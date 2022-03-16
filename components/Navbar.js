import Link from "next/link";
import { useRouter } from "next/router";

export function Navbar() {
  const router = useRouter();

  return (
    <div className="flex w-full border-b border-gray-300  items-center justify-center space-x-6 h-12 text-xl mb-3">
      <Link href="/" passHref>
        <div
          className={`rounded-md px-3 py-2 hover:bg-pink-100 cursor-pointer
        ${router.pathname == "/" ? "font-semibold" : ""}
        `}
        >
          😷 Covid swab list
        </div>
      </Link>

      <Link href="/about" passHref>
        <div
          className={`rounded-md px-3 py-2 hover:bg-pink-100 cursor-pointer
        ${router.pathname == "/about" ? "font-semibold" : ""}
        `}
        >
          About
        </div>
      </Link>
    </div>
  );
}
