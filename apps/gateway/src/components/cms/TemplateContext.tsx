"use client";

import { createContext, useContext } from "react";

/**
 * Client-side context for section builder templates.
 *
 * Templates are fetched server-side by TemplateProvider and injected here
 * so client components (PremadeSectionWrapper) can access them without
 * importing `postgres` (which is Node.js-only).
 */
type TemplateMap = Record<string, any>;

const TemplateContext = createContext<TemplateMap>({});

export function TemplateContextProvider({
  templates,
  children,
}: {
  templates: TemplateMap;
  children: React.ReactNode;
}) {
  return (
    <TemplateContext.Provider value={templates}>
      {children}
    </TemplateContext.Provider>
  );
}

export function useTemplates(): TemplateMap {
  return useContext(TemplateContext);
}
