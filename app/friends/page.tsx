"use client";
import Spinner from "@/components/Spinner";
import { ChevronDown, Users2 } from "lucide-react";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import PrettyButton from "@/components/General/PrettyButton";
import { useFriends } from "@/lib/hooks/api/user/useFriends";
import UserElement from "@/components/UserElement";
import Image from "next/image";

export default function Friends() {
  const { data, setSize, size, isLoading, isValidating } = useFriends(9);

  const handleShowMore = () => {
    setSize(size + 1);
  };

  const friends = data?.flatMap((item) => item.friends);
  const totalCount = data?.find(
    (item) => item.total_count !== undefined
  )?.total_count;

  return (
    <div className="flex flex-col w-full space-y-4">
      <PrettyHeader text="Your Friends" icon={<Users2 />} roundBottom={true} />

      {isLoading && (
        <div className="flex justify-center items-center h-96">
          <Spinner size="xl" />
        </div>
      )}

      {!isLoading &&
        friends != undefined &&
        (totalCount != undefined && totalCount > 0 ? (
          <RoundedContent className="min-h-0 h-fit max-h-none rounded-t-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {friends?.map((friend) => (
                <div key={`friend-${friend.user_id}`} className="mb-2">
                  <UserElement user={friend} includeFriendshipButton />
                </div>
              ))}
            </div>

            {friends.length < totalCount && (
              <div className="flex justify-center mt-4">
                <PrettyButton
                  text="Show more"
                  onClick={handleShowMore}
                  icon={<ChevronDown />}
                  className="w-full md:w-1/2 flex items-center justify-center"
                  isLoading={isLoading || isValidating}
                />
              </div>
            )}
          </RoundedContent>
        ) : (
          <RoundedContent className="rounded-l flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
            <div className="flex flex-col space-y-2">
              <h1 className="text-4xl">You have no friends</h1>
              <p className="text-gray-300">
                That's just sad... Go add someone! It's not too late!
              </p>
            </div>
            <Image
              src="/images/user-not-found.png"
              alt="404"
              width={200}
              height={400}
              className="max-w-fit"
            />
          </RoundedContent>
        ))}
    </div>
  );
}
