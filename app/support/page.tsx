import {
  BookCopy,
  HeartHandshake,
  LucideMessageCircleQuestion,
} from "lucide-react";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SupportUs() {
  return (
    <div className="flex flex-col w-full space-y-4">
      <PrettyHeader
        text="Support Us"
        icon={<HeartHandshake />}
        roundBottom={true}
      />

      <div>
        <PrettyHeader
          text="How You Can Help Us"
          icon={<LucideMessageCircleQuestion />}
        />
        <RoundedContent>
          <div className="flex flex-col w-11/12 mx-auto">
            <div className="flex lg:flex-row flex-col">
              <div className="space-y-4">
                <h2 className="text-sm">
                  While all osu!sunrise features has always been free, running
                  and improving the server requires resources, time, and effort,
                  while being mainly maintained by a <b>single</b> developer.
                  <br />
                  <br /> If you love osu!sunrise and want to see it grow even
                  further, here are a few ways you can support us:
                </h2>

                <ol className="list-decimal list-inside space-y-4">
                  {(process.env.NEXT_PUBLIC_KOFI_LINK ||
                    process.env.NEXT_PUBLIC_BOOSTY_LINK) && (
                    <div>
                      <li>
                        <span className="font-bold">Donate.</span>
                        <p className="text-sm">
                          Your generous donations help us maintain and enhance
                          the osu! servers. Every little bit counts! With your
                          support, we can cover hosting costs, implement new
                          features, and ensure a smoother experience for
                          everyone.{" "}
                        </p>
                      </li>
                      <div className="space-x-4 my-2">
                        {process.env.NEXT_PUBLIC_KOFI_LINK && (
                          <Button size="lg" asChild>
                            <Link href={process.env.NEXT_PUBLIC_KOFI_LINK}>
                              Ko-fi
                            </Link>
                          </Button>
                        )}
                        {process.env.NEXT_PUBLIC_BOOSTY_LINK && (
                          <Button size="lg" asChild>
                            <Link href={process.env.NEXT_PUBLIC_BOOSTY_LINK}>
                              Boosty
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                  <li>
                    <span className="font-bold">Spread the Word.</span>
                    <p className="text-sm">
                      The more people who know about osu!sunrise, the more
                      vibrant and exciting our community will be. Tell your
                      friends, share on social media, and invite new players to
                      join.
                    </p>
                  </li>
                  <li>
                    <span className="font-bold">Just Play on the Server.</span>
                    <p className="text-sm">
                      One of the easiest ways to support osu!sunrise is simply
                      by playing on the server! The more players we have, the
                      better the community and experience become. By joining in,
                      you’re helping to grow the server and keeping it active
                      for all players.
                    </p>
                  </li>
                </ol>
              </div>
              <Image
                src="/images/supportus.png"
                alt="frontpage image"
                width={1150}
                height={1150}
                className="rounded-lg w-full h-full md:min-h-96 md:min-w-96"
              />
            </div>
          </div>
        </RoundedContent>
      </div>
    </div>
  );
}
