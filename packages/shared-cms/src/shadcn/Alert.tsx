"use client";

import { storyblokEditable } from "@storyblok/react";
import { Alert, AlertTitle, AlertDescription, cn } from "@repo/ui";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import type { SbBlokData } from "@storyblok/react";
import { buildStyleClasses, type FlexBreakpointOptionsBlok } from "../styles";

export interface ShadcnAlertBlok extends SbBlokData {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  icon?: "info" | "warning" | "success" | "error" | "none";
  styles?: FlexBreakpointOptionsBlok[];
}

const iconMap = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
  error: AlertCircle,
  none: null,
};

export function ShadcnAlert({ blok }: { blok: ShadcnAlertBlok }) {
  const Icon = iconMap[blok.icon || "info"];

  return (
    <Alert
      {...storyblokEditable(blok)}
      variant={blok.variant || "default"}
      className={cn(...buildStyleClasses(blok.styles))}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {blok.title && <AlertTitle>{blok.title}</AlertTitle>}
      {blok.description && (
        <AlertDescription>{blok.description}</AlertDescription>
      )}
    </Alert>
  );
}
