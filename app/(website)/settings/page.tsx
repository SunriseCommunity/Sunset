"use client";
import ImageSelect from "@/components/General/ImageSelect";
import Spinner from "@/components/Spinner";
import useSelf from "@/lib/hooks/useSelf";
import {
  CheckSquare,
  CloudUpload,
  Cog,
  FlagIcon,
  Image,
  LockOpenIcon,
  NotebookPenIcon,
  User2Icon,
} from "lucide-react";
import { useEffect, useState } from "react";
import PrettyHeader from "@/components/General/PrettyHeader";
import BBCodeInput from "../../../components/BBCode/BBCodeInput";
import ChangePasswordInput from "@/app/(website)/settings/components/ChangePasswordInput";
import SiteLocalOptions from "@/app/(website)/settings/components/SiteLocalOptions";
import ChangeUsernameInput from "@/app/(website)/settings/components/ChangeUsernameInput";
import { useEditDescription } from "@/lib/hooks/api/user/useEditDescription";
import { useUserUpload } from "@/lib/hooks/api/user/useUserUpload";
import RoundedContent from "@/components/General/RoundedContent";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ChangeSocialsForm from "@/app/(website)/settings/components/ChangeSocialsForm";
import { useUserMetadata } from "@/lib/hooks/api/user/useUserMetadata";
import ChangePlaystyleForm from "@/app/(website)/settings/components/ChangePlaystyleForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import UploadImageForm from "@/app/(website)/settings/components/UploadImageForm";
import ChangeCountryInput from "@/app/(website)/settings/components/ChangeCountryInput";
import ChangeDescriptionInput from "@/app/(website)/settings/components/ChangeDescriptionInput";

export default function Settings() {
  const { self, isLoading } = useSelf();
  const { data: userMetadata } = useUserMetadata(self?.user_id ?? null);

  const settingsContent = [
    {
      openByDefault: true,
      icon: <User2Icon />,
      title: "Change avatar",
      content: (
        <RoundedContent>
          <div className="flex flex-col w-11/12 mx-auto">
            <UploadImageForm type="avatar" />
          </div>
        </RoundedContent>
      ),
    },
    {
      openByDefault: true,
      icon: <Image />,
      title: "Change banner",
      content: (
        <RoundedContent>
          <div className="flex flex-col w-11/12 mx-auto">
            <UploadImageForm type="banner" />
          </div>
        </RoundedContent>
      ),
    },
    {
      icon: <NotebookPenIcon />,
      title: "Change description",
      content: (
        <RoundedContent>
          <div className="flex flex-col w-11/12 mx-auto">
            {self ? (
              <>
                <ChangeDescriptionInput user={self} />{" "}
                <label className="text-xs mt-2">
                  * Reminder: Do not post any inappropriate content. Try to keep
                  it family friendly :)
                </label>
              </>
            ) : (
              <Spinner />
            )}
          </div>
        </RoundedContent>
      ),
    },
    {
      icon: <User2Icon />,
      title: "Socials",
      content: (
        <RoundedContent>
          <div className="flex flex-col w-11/12 mx-auto">
            {userMetadata && self ? (
              <ChangeSocialsForm metadata={userMetadata} user={self} />
            ) : (
              <Spinner />
            )}
          </div>
        </RoundedContent>
      ),
    },
    {
      icon: <User2Icon />,
      title: "Playstyle",
      content: (
        <RoundedContent>
          <div className="flex flex-col w-11/12 mx-auto">
            {userMetadata && self ? (
              <ChangePlaystyleForm metadata={userMetadata} user={self} />
            ) : (
              <Spinner />
            )}
          </div>
        </RoundedContent>
      ),
    },
    {
      icon: <CheckSquare />,
      title: "Options",
      content: (
        <RoundedContent>
          <div className="flex flex-col w-11/12 mx-auto">
            <SiteLocalOptions />
          </div>
        </RoundedContent>
      ),
    },
    {
      icon: <LockOpenIcon />,
      title: "Change password",
      content: (
        <RoundedContent>
          <div className="flex flex-col w-11/12 mx-auto">
            <ChangePasswordInput />
          </div>
        </RoundedContent>
      ),
    },
    {
      icon: <User2Icon />,
      title: "Change username",
      content: (
        <RoundedContent>
          <div className="flex flex-col w-11/12 mx-auto">
            <ChangeUsernameInput />
          </div>
        </RoundedContent>
      ),
    },
    {
      icon: <FlagIcon />,
      title: "Change country flag",
      content: (
        <RoundedContent>
          <div className="flex flex-col w-11/12 mx-auto">
            {self ? <ChangeCountryInput user={self} /> : ""}
          </div>
        </RoundedContent>
      ),
    },
  ];

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner size="xl" />
      </div>
    );

  return (
    <div className="flex flex-col w-full space-y-4">
      <PrettyHeader
        text="Settings"
        icon={<Cog className="mr-2" />}
        roundBottom
      />

      {self ? (
        <>
          <Accordion
            type="multiple"
            className="space-y-4"
            defaultValue={settingsContent
              .filter((v) => v.openByDefault)
              .map((_, i) => i.toString())}
          >
            {settingsContent.map(({ icon, title, content }, index) => (
              <AccordionItem
                id={`accordion-item-${index}`}
                key={index}
                value={index.toString()}
                className="border-b-0"
              >
                <AccordionTrigger className="bg-card rounded-t-lg p-4 flex shadow  [&[data-state=closed]]:rounded-lg">
                  <div className="flex space-x-2 items-center">
                    {icon}
                    <p>{title}</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent>{content}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </>
      ) : (
        <RoundedContent className="rounded-lg">
          You must be logged in to view this page.
        </RoundedContent>
      )}
    </div>
  );
}
