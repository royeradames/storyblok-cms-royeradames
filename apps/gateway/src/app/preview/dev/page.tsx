"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
} from "@repo/ui";
import {
  PRESET_SCENARIOS,
  isPreset,
  SeedDataProvider,
  useSeedData,
  type Scenario,
} from "@repo/shared-cms/dev";

// For now, just use presets. CMS scenarios would be fetched from API
const allScenarios: Scenario[] = [...PRESET_SCENARIOS];

function ScenarioManager() {
  const { scenario, scenarioId, setScenarioId } = useSeedData();

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🔧 Dev Scenario Manager</h1>
        <p className="text-muted-foreground">
          Select and manage mock data scenarios for preview mode.
        </p>
      </div>

      <div className="grid gap-4">
        {allScenarios.map((s) => (
          <Card
            key={s.id}
            className={`cursor-pointer transition-colors ${
              scenarioId === s.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setScenarioId(s.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isPreset(s.id) && <span>🔒</span>}
                  <CardTitle className="text-lg">{s.name}</CardTitle>
                  <Badge variant={isPreset(s.id) ? "secondary" : "default"}>
                    {s.type}
                  </Badge>
                </div>
                {scenarioId === s.id && <Badge variant="default">Active</Badge>}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                {s.description}
              </p>
              <div className="flex gap-4 text-sm">
                <span>Users: {s.user_data.length}</span>
                <span>Orders: {s.orders_data.length}</span>
                <span>Notifications: {s.notifications_data.length}</span>
                <span>Flags: {Object.keys(s.flags).length}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {scenario && (
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h2 className="font-bold mb-4">Active Scenario Details</h2>
          <pre className="text-xs overflow-auto max-h-96">
            {JSON.stringify(scenario, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-8 flex gap-4">
        <Button variant="outline" onClick={() => setScenarioId(null)}>
          Clear Selection
        </Button>
        <Button asChild>
          <a href="/preview">Back to Preview</a>
        </Button>
      </div>
    </div>
  );
}

export default function DevPage() {
  return (
    <SeedDataProvider scenarios={allScenarios}>
      <ScenarioManager />
    </SeedDataProvider>
  );
}
