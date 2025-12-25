"use client";
import {
  CheckSquare,
  Cog,
  FlagIcon,
  Image,
  LockOpenIcon,
  NotebookPenIcon,
  User2Icon,
} from "lucide-react";
import { useMemo } from "react";

import ChangeCountryInput from "@/app/(website)/settings/components/ChangeCountryInput";
import ChangeDescriptionInput from "@/app/(website)/settings/components/ChangeDescriptionInput";
import ChangePasswordInput from "@/app/(website)/settings/components/ChangePasswordInput";
import ChangePlaystyleForm from "@/app/(website)/settings/components/ChangePlaystyleForm";
import ChangeSocialsForm from "@/app/(website)/settings/components/ChangeSocialsForm";
import ChangeUsernameInput from "@/app/(website)/settings/components/ChangeUsernameInput";
import SiteLocalOptions from "@/app/(website)/settings/components/SiteLocalOptions";
import UploadImageForm from "@/app/(website)/settings/components/UploadImageForm";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import Spinner from "@/components/Spinner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useUserMetadata } from "@/lib/hooks/api/user/useUserMetadata";
import useSelf from "@/lib/hooks/useSelf";
import { useT } from "@/lib/i18n/utils";

export default function Settings() {
  const t = useT("pages.settings");
  const { self, isLoading } = useSelf();
  const { data: userMetadata } = useUserMetadata(self?.user_id ?? null);

  const settingsContent = useMemo(
    () => [
      {
        openByDefault: true,
        icon: <User2Icon />,
        title: t("sections.changeAvatar"),
        content: (
          <RoundedContent>
            <div className="mx-auto flex w-11/12 flex-col">
              <UploadImageForm type="avatar" />
            </div>
          </RoundedContent>
        ),
      },
      {
        openByDefault: true,
        icon: <Image />,
        title: t("sections.changeBanner"),
        content: (
          <RoundedContent>
            <div className="mx-auto flex w-11/12 flex-col">
              <UploadImageForm type="banner" />
            </div>
          </RoundedContent>
        ),
      },
      {
        icon: <NotebookPenIcon />,
        title: t("sections.changeDescription"),
        content: (
          <RoundedContent>
            <div className="mx-auto flex w-11/12 flex-col">
              {self ? (
                <>
                  <ChangeDescriptionInput user={self} />
                  {" "}
                  <label className="mt-2 text-xs">
                    {t("description.reminder")}
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
        title: t("sections.socials"),
        content: (
          <RoundedContent>
            <div className="mx-auto flex w-11/12 flex-col">
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
        title: t("sections.playstyle"),
        content: (
          <RoundedContent>
            <div className="mx-auto flex w-11/12 flex-col">
              <div className="flex flex-col lg:w-1/2">
                {userMetadata && self ? (
                  <ChangePlaystyleForm metadata={userMetadata} user={self} />
                ) : (
                  <Spinner />
                )}
              </div>
            </div>
          </RoundedContent>
        ),
      },
      {
        icon: <CheckSquare />,
        title: t("sections.options"),
        content: (
          <RoundedContent>
            <div className="mx-auto flex w-11/12 flex-col">
              <SiteLocalOptions />
            </div>
          </RoundedContent>
        ),
      },
      {
        icon: <LockOpenIcon />,
        title: t("sections.changePassword"),
        content: (
          <RoundedContent>
            <div className="mx-auto flex w-11/12 flex-col">
              <ChangePasswordInput />
            </div>
          </RoundedContent>
        ),
      },
      {
        icon: <User2Icon />,
        title: t("sections.changeUsername"),
        content: (
          <RoundedContent>
            <div className="mx-auto flex w-11/12 flex-col">
              <ChangeUsernameInput />
            </div>
          </RoundedContent>
        ),
      },
      {
        icon: <FlagIcon />,
        title: t("sections.changeCountryFlag"),
        content: (
          <RoundedContent>
            <div className="mx-auto flex w-11/12 flex-col">
              {self ? <ChangeCountryInput user={self} /> : ""}
            </div>
          </RoundedContent>
        ),
      },
    ],
    [t, self, userMetadata],
  );

  const defaultOpenValues = useMemo(
    () =>
      settingsContent
        .filter(v => v.openByDefault)
        .map((_, i) => i.toString()),
    [settingsContent],
  );

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col space-y-4">
      <PrettyHeader
        text={t("header")}
        icon={<Cog className="mr-2" />}
        roundBottom
      />

      {self ? (
        <>
          <Accordion
            type="multiple"
            className="space-y-4"
            defaultValue={defaultOpenValues}
          >
            {settingsContent.map(({ icon, title, content }, index) => (
              <AccordionItem
                id={`accordion-item-${index}`}
                key={`accordion-item-${title}`}
                value={index.toString()}
                className="border-b-0"
              >
                <AccordionTrigger className="flex rounded-t-lg bg-card p-4 shadow  [&[data-state=closed]]:rounded-lg">
                  <div className="flex items-center space-x-2">
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
          {t("notLoggedIn")}
        </RoundedContent>
      )}
    </div>
  );
}
