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
import { useMemo } from "react";
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
            <div className="flex flex-col w-11/12 mx-auto">
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
            <div className="flex flex-col w-11/12 mx-auto">
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
            <div className="flex flex-col w-11/12 mx-auto">
              {self ? (
                <>
                  <ChangeDescriptionInput user={self} />{" "}
                  <label className="text-xs mt-2">
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
        title: t("sections.playstyle"),
        content: (
          <RoundedContent>
            <div className="flex flex-col w-11/12 mx-auto">
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
            <div className="flex flex-col w-11/12 mx-auto">
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
            <div className="flex flex-col w-11/12 mx-auto">
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
            <div className="flex flex-col w-11/12 mx-auto">
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
            <div className="flex flex-col w-11/12 mx-auto">
              {self ? <ChangeCountryInput user={self} /> : ""}
            </div>
          </RoundedContent>
        ),
      },
    ],
    [t, self, userMetadata]
  );

  const defaultOpenValues = useMemo(
    () =>
      settingsContent
        .filter((v) => v.openByDefault)
        .map((_, i) => i.toString()),
    [settingsContent]
  );

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner size="xl" />
      </div>
    );

  return (
    <div className="flex flex-col w-full space-y-4">
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
          {t("notLoggedIn")}
        </RoundedContent>
      )}
    </div>
  );
}
