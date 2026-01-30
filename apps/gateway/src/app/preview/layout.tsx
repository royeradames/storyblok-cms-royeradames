import { draftMode } from "next/headers";
import { StoryblokProvider } from "@/components/StoryblokProvider";
import { DraftToolbar } from "@/components/DraftToolbar";

export default async function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const draft = await draftMode();
  draft.enable();

  return (
    <StoryblokProvider>
      <DraftToolbar />
      {children}
    </StoryblokProvider>
  );
}
