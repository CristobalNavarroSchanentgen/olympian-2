export interface HealthService {
  checkHealth(serviceId: string): Promise<any>;
  getOverallHealth(): Promise<any>;
  performHealthCheck(): Promise<boolean>;
}

