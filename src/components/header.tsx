import Link from "next/link";
import { ThemeToggleButton } from "./theme-toggle-button";
import { BookText } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <BookText className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-lg">ContentHub</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <ThemeToggleButton />
        </div>
      </div>
    </header>
  );
}
