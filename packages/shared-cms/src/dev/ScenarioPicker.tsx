"use client";

import { storyblokEditable } from "@storyblok/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
} from "@repo/ui";
import { useSeedData } from "./SeedDataContext";
import { isPreset } from "./presets";
import type { SbBlokData } from "@storyblok/react";
import type { Scenario } from "./types";

export interface DevScenarioPickerBlok extends SbBlokData {
  title?: string;
  show_details?: boolean;
}

interface DevScenarioPickerProps {
  blok: DevScenarioPickerBlok;
  scenarios: Scenario[];
}

export function DevScenarioPicker({ blok, scenarios }: DevScenarioPickerProps) {
  const { scenario, scenarioId, setScenarioId } = useSeedData();

  return (
    <div
      {...storyblokEditable(blok)}
      className="p-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🔧</span>
        <h3 className="font-bold text-yellow-800">
          {blok.title || "Dev Mode: Scenario Control"}
        </h3>
      </div>

      <Select value={scenarioId || ""} onValueChange={setScenarioId}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a scenario..." />
        </SelectTrigger>
        <SelectContent>
          {scenarios.map((s) => (
            <SelectItem key={s.id} value={s.id}>
              <div className="flex items-center gap-2">
                {isPreset(s.id) && <span>🔒</span>}
                <span>{s.name}</span>
                <Badge variant={isPreset(s.id) ? "secondary" : "default"}>
                  {s.type}
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {blok.show_details && scenario && (
        <div className="mt-3 text-sm text-yellow-700 space-y-1">
          <p>
            <strong>Description:</strong>{" "}
            {scenario.description || "No description"}
          </p>
          <p>
            <strong>Users:</strong> {scenario.user_data.length}
          </p>
          <p>
            <strong>Orders:</strong> {scenario.orders_data.length}
          </p>
          <p>
            <strong>Notifications:</strong> {scenario.notifications_data.length}
          </p>
          <p>
            <strong>Flags:</strong> {Object.keys(scenario.flags).length}
          </p>
        </div>
      )}
    </div>
  );
}
