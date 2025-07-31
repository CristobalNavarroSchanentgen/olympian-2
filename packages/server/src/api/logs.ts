// Browser Logs API Routes
// Handles browser log collection and aggregation

import { Router, Request, Response } from 'express';
import { BrowserLogEntry, UserInteractionLog } from '../../../../features/observability/browser-logger/contract';

const router = Router();

// In-memory log storage (replace with database in production)
const logStorage = new Map<string, BrowserLogEntry[]>();
const interactionStorage = new Map<string, UserInteractionLog[]>();

// POST /api/logs - Receive browser logs
router.post('/', async (req: Request, res: Response) => {
  try {
    const { logs, interactions } = req.body;
    
    if (logs && Array.isArray(logs)) {
      logs.forEach((log: BrowserLogEntry) => {
        const sessionLogs = logStorage.get(log.sessionId) || [];
        sessionLogs.push(log);
        logStorage.set(log.sessionId, sessionLogs);
      });
    }
    
    if (interactions && Array.isArray(interactions)) {
      interactions.forEach((interaction: UserInteractionLog) => {
        const sessionInteractions = interactionStorage.get(interaction.sessionId) || [];
        sessionInteractions.push(interaction);
        interactionStorage.set(interaction.sessionId, sessionInteractions);
      });
    }
    
    res.status(200).json({ success: true, received: logs?.length || 0 });
  } catch (error) {
    console.error('Error processing browser logs:', error);
    res.status(500).json({ error: 'Failed to process logs' });
  }
});

// GET /api/logs - Retrieve aggregated logs
router.get('/', async (req: Request, res: Response) => {
  try {
    const { 
      sessionId, 
      level, 
      source, 
      startTime, 
      endTime,
      format = 'json',
      includeInteractions = 'false'
    } = req.query;
    
    let allLogs: BrowserLogEntry[] = [];
    
    if (sessionId && typeof sessionId === 'string') {
      allLogs = logStorage.get(sessionId) || [];
    } else {
      // Aggregate all sessions
      for (const logs of logStorage.values()) {
        allLogs.push(...logs);
      }
    }
    
    // Apply filters
    if (level && typeof level === 'string') {
      allLogs = allLogs.filter(log => log.level === level);
    }
    
    if (source && typeof source === 'string') {
      allLogs = allLogs.filter(log => log.source === source);
    }
    
    if (startTime && typeof startTime === 'string') {
      const start = new Date(startTime);
      allLogs = allLogs.filter(log => new Date(log.timestamp) >= start);
    }
    
    if (endTime && typeof endTime === 'string') {
      const end = new Date(endTime);
      allLogs = allLogs.filter(log => new Date(log.timestamp) <= end);
    }
    
    // Sort by timestamp
    allLogs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    let result: any = { logs: allLogs };
    
    if (includeInteractions === 'true') {
      let allInteractions: UserInteractionLog[] = [];
      
      if (sessionId && typeof sessionId === 'string') {
        allInteractions = interactionStorage.get(sessionId) || [];
      } else {
        for (const interactions of interactionStorage.values()) {
          allInteractions.push(...interactions);
        }
      }
      
      result.interactions = allInteractions;
    }
    
    if (format === 'csv') {
      const csvLogs = convertLogsToCSV(allLogs);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="browser-logs.csv"');
      return res.send(csvLogs);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error retrieving logs:', error);
    res.status(500).json({ error: 'Failed to retrieve logs' });
  }
});

// GET /api/logs/stats - Get logging statistics
router.get('/stats', async (req: Request, res: Response) => {
  try {
    let totalLogs = 0;
    let errorCount = 0;
    let warningCount = 0;
    let lastLogTime: Date | null = null;
    
    for (const logs of logStorage.values()) {
      totalLogs += logs.length;
      
      logs.forEach(log => {
        if (log.level === 'error') errorCount++;
        if (log.level === 'warn') warningCount++;
        
        const logTime = new Date(log.timestamp);
        if (!lastLogTime || logTime > lastLogTime) {
          lastLogTime = logTime;
        }
      });
    }
    
    res.json({
      totalLogs,
      errorCount,
      warningCount,
      lastLogTime,
      activeSessions: logStorage.size
    });
  } catch (error) {
    console.error('Error getting log stats:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

// DELETE /api/logs/:sessionId - Clear logs for a session
router.delete('/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    
    logStorage.delete(sessionId);
    interactionStorage.delete(sessionId);
    
    res.json({ success: true, message: 'Session logs cleared' });
  } catch (error) {
    console.error('Error clearing logs:', error);
    res.status(500).json({ error: 'Failed to clear logs' });
  }
});

function convertLogsToCSV(logs: BrowserLogEntry[]): string {
  const headers = ['timestamp', 'level', 'source', 'message', 'sessionId', 'url'];
  const csvLines = [headers.join(',')];
  
  logs.forEach(log => {
    const row = [
      log.timestamp,
      log.level,
      log.source,
      JSON.stringify(log.message).replace(/"/g, '""'),
      log.sessionId,
      log.url || ''
    ];
    csvLines.push(row.join(','));
  });
  
  return csvLines.join('\n');
}

export default router;