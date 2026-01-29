import type { Scenario } from "./types";

/**
 * Code presets - always available, read-only, version controlled
 */
export const PRESET_SCENARIOS: Scenario[] = [
  {
    id: "preset:empty-user",
    name: "Empty User",
    type: "preset",
    description: "New user with no data - test empty states",
    readonly: true,
    user_data: [
      {
        id: "user-empty-001",
        name: "New User",
        email: "new@example.com",
        avatar_url: null,
        role: "user",
        subscription_tier: "free",
        is_verified: false,
      },
    ],
    orders_data: [],
    notifications_data: [],
    flags: {
      is_new_user: true,
      show_onboarding: true,
    },
  },
  {
    id: "preset:power-user",
    name: "Power User",
    type: "preset",
    description: "Heavy user with lots of data - test performance",
    readonly: true,
    user_data: [
      {
        id: "user-power-001",
        name: "Power User Pro",
        email: "power@example.com",
        avatar_url: "/avatars/power.png",
        role: "admin",
        subscription_tier: "enterprise",
        is_verified: true,
      },
    ],
    orders_data: Array.from({ length: 100 }, (_, i) => {
      const statuses = ["pending", "completed", "shipped"] as const;
      return {
        id: `order-${i}`,
        status: statuses[i % 3] as "pending" | "completed" | "shipped",
        total: Math.floor(Math.random() * 500) + 10,
        items_count: Math.floor(Math.random() * 10) + 1,
      };
    }),
    notifications_data: Array.from({ length: 20 }, (_, i) => {
      const types = ["info", "warning", "success"] as const;
      return {
        id: `notif-${i}`,
        type: types[i % 3] as "info" | "warning" | "success",
        message: `Notification message ${i + 1}`,
        read: i < 5,
      };
    }),
    flags: {
      has_beta_access: true,
      show_admin_panel: true,
      enable_advanced_features: true,
    },
  },
  {
    id: "preset:error-states",
    name: "Error States",
    type: "preset",
    description: "Simulate various error conditions",
    readonly: true,
    user_data: [
      {
        id: "user-error-001",
        name: "Error Test User",
        email: "error@example.com",
        avatar_url: null,
        role: "user",
        subscription_tier: "free",
        is_verified: true,
      },
    ],
    orders_data: [],
    notifications_data: [
      {
        id: "notif-error-1",
        type: "error",
        message: "Payment failed",
        read: false,
      },
    ],
    flags: {
      simulate_api_error: true,
      simulate_network_timeout: false,
      simulate_auth_expired: false,
      simulate_rate_limit: false,
    },
  },
  {
    id: "preset:edge-cases",
    name: "Edge Cases",
    type: "preset",
    description: "Boundary conditions and unusual data",
    readonly: true,
    user_data: [
      {
        id: "user-edge-001",
        name: "Ａｖｅｒｙ Ｌｏｎｇ Ｎａｍｅ Ｔｈａｔ Ｍｉｇｈｔ Ｂｒｅａｋ ＵＩ 🎉",
        email: "edge+case+special@example.com",
        avatar_url: "",
        role: "user",
        subscription_tier: "pro",
        is_verified: true,
      },
    ],
    orders_data: [
      {
        id: "order-max",
        status: "pending",
        total: 999999.99,
        items_count: 9999,
      },
      {
        id: "order-zero",
        status: "completed",
        total: 0,
        items_count: 0,
      },
    ],
    notifications_data: [],
    flags: {
      test_null_handling: true,
      test_unicode: true,
      test_max_values: true,
    },
  },
];

export function getPresetById(id: string): Scenario | undefined {
  return PRESET_SCENARIOS.find((s) => s.id === id);
}

export function isPreset(id: string): boolean {
  return id.startsWith("preset:");
}
