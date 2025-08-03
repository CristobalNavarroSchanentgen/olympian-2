export interface LayoutService {
  updateLayout(layoutId: string, config: any): Promise<void>;
  getLayout(layoutId: string): Promise<any>;
  saveLayoutPreferences(userId: string, preferences: any): Promise<void>;
  loadLayoutPreferences(userId: string): Promise<any>;
}

