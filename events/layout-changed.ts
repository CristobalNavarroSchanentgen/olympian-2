/**
 * Layout Changed Event
 * Emitted when UI layout is changed
 */

export interface LayoutChangedEvent {
  layoutId: string;
  layoutType: string;
  timestamp: Date;
  configuration: Record<string, any>;
  userId?: string;
}
