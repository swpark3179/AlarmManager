export type RepeatType = 'None' | 'Daily' | 'Weekly' | 'Monthly';

export interface TriggerInfo {
  date?: string | null;      // YYYY-MM-DD
  time?: string | null;      // HH:mm
  days_of_week?: string[] | null; // e.g., ["Monday", "Tuesday"]
  weeks_of_month?: string | null; // e.g., "First", "Last"
}

export interface Alarm {
  id: string;
  title: string;
  repeat_type: RepeatType;
  triggers: TriggerInfo[];
  enabled: boolean;
  order: number;
}
