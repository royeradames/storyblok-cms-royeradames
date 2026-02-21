"use client";

import { createContext, useContext } from "react";

/**
 * Client-side context for template generation metadata.
 *
 * Metadata is provided server-side by TemplateProvider and consumed by client
 * wrappers for error messaging and status guidance.
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
