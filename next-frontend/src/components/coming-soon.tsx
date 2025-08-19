import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ComingSoonPage() {
  return (
    <div className="container flex flex-col items-center justify-center h-full text-center p-4">
      <h1 className="text-3xl font-bold mb-4">🚧 Coming Soon!</h1>
      <p className="mb-6 text-gray-600">This page is not implemented yet.</p>
      <Button asChild>
        <Link href={"/dashboard/"}>Go Home</Link>
      </Button>
    </div>
  );
}
