export interface ProcessService {
  startProcess(processId: string, command: string, args: string[]): Promise<void>;
  stopProcess(processId: string): Promise<void>;
  isProcessRunning(processId: string): boolean;
  getProcessStatus(processId: string): any;
}

