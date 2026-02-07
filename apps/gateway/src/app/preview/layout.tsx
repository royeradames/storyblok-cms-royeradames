import { draftMode } from "next/headers";
import { StoryblokProvider } from "@/components/StoryblokProvider";
import { DraftToolbar } from "@/components/DraftToolbar";
import { BuildStatusBanner } from "@/components/cms/BuildStatusBanner";

export default async function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const draft = await draftMode();
  draft.enable();

  return (
    <StoryblokProvider>
      <BuildStatusBanner />
      <DraftToolbar />
      {children}
    </StoryblokProvider>
  );
}
