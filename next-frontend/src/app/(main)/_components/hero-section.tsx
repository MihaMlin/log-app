import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroHeader } from "./header";

export default function HeroSection() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-x-hidden">
        <section>
          <div className="pb-24 pt-12 md:pb-32 lg:pb-56 lg:pt-44">
            <div className="relative mx-auto flex max-w-6xl flex-col px-6 lg:block">
              <div className="mx-auto max-w-lg text-center lg:ml-0 lg:w-1/2 lg:text-left">
                <h1 className="mt-8 max-w-2xl text-balance text-5xl font-medium md:text-6xl lg:mt-16 xl:text-7xl">
                  Track. Analyze. Improve.
                </h1>
                <p className="mt-8 max-w-2xl text-pretty text-lg">
                  Keep all your logs organized, gain insights instantly, and
                  make smarter decisions every day. Simple, fast, and reliable.
                </p>

                <div className="mt-12 flex flex-col items-center justify-center gap-2 sm:flex-row lg:justify-start">
                  <Button asChild size="lg" className="px-5 text-base">
                    <Link href="/dashboard">
                      <span className="text-nowrap">Start Logging</span>
                    </Link>
                  </Button>
                  <Button
                    key={2}
                    asChild
                    size="lg"
                    variant="ghost"
                    className="px-5 text-base"
                  >
                    <Link
                      href="https://github.com/MihaMlin/log-app"
                      target="_blank"
                    >
                      <span className="text-nowrap">View on GitHub</span>
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="order-first ml-auto h-56 w-full sm:h-96 lg:absolute lg:inset-0 lg:-right-20 lg:-top-16 lg:order-last lg:h-auto lg:w-2/3 -z-10">
                <img
                  className="h-full w-full object-contain invert dark:mix-blend-lighten dark:invert-0"
                  src="/images/hero.png"
                  alt="Abstract Object"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
