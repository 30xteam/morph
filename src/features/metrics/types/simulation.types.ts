import type { JevProvider } from '@/core/jev/jev.types';
import type { Trigger } from '@/libs/segmentation';

export interface SimulationResult {
  provider: JevProvider;
  calibrated: boolean;
  days: number;
  profiles: number;
  decisions: number;
  jevCalls: number;
  totalCostUsd: number;
  changedLight: number;
  newGreens: number;
  timeline: { day: number; decisions: number; green: number; yellow: number; red: number }[];
  transitions: { day: number; alias: string; trigger: Trigger; from: string; to: string }[];
}
