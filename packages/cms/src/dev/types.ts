export interface MockUser {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  role: "admin" | "user" | "guest";
  subscription_tier: "free" | "pro" | "enterprise";
  is_verified: boolean;
  created_at?: string;
}

export interface MockOrder {
  id: string;
  status: "pending" | "completed" | "shipped" | "cancelled" | "refunded";
  total: number;
  items_count: number;
  created_at?: string;
}

export interface MockNotification {
  id: string;
  type: "info" | "warning" | "success" | "error";
  message: string;
  read: boolean;
  created_at?: string;
}

export interface MockFlag {
  key: string;
  value: boolean;
  description?: string;
}

export interface Scenario {
  id: string;
  name: string;
  type: "preset" | "cms";
  description?: string;
  user_data: MockUser[];
  orders_data: MockOrder[];
  notifications_data: MockNotification[];
  flags: Record<string, boolean>;
  readonly?: boolean;
}
