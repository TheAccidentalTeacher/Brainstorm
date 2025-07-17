// Frontend debugging utilities for production

interface DebugContext {
  userId?: string;
  sessionId?: string;
  page?: string;
  component?: string;
  action?: string;
  [key: string]: any;
}

class FrontendLogger {
  private context: DebugContext = {};
  private isProduction: boolean;
  private logs: any[] = [];
  private maxLogs: number = 1000;

  constructor() {
    this.isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost';
    
    // Make logger available globally for F12 debugging
    if (typeof window !== 'undefined') {
      (window as any).debugLogger = this;
      (window as any).getLogs = () => this.getLogs();
      (window as any).clearLogs = () => this.clearLogs();
      (window as any).downloadLogs = () => this.downloadLogs();
      (window as any).setDebugMode = (enabled: boolean) => this.setDebugMode(enabled);
    }
  }

  setContext(context: DebugContext) {
    this.context = { ...this.context, ...context };
  }

  private createLogEntry(level: string, message: string, data?: any) {
    const entry = {
      timestamp: new Date().toISOString(),
      level: level.toUpperCase(),
      message,
      context: { ...this.context },
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      ...(data && { data })
    };

    // Store logs for debugging
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    return entry;
  }

  info(message: string, data?: any) {
    const entry = this.createLogEntry('info', message, data);
    
    if (!this.isProduction || this.getDebugMode()) {
      console.log(`🔵 ${message}`, data || '', `Context:`, this.context);
    }
    
    return entry;
  }

  warn(message: string, data?: any) {
    const entry = this.createLogEntry('warn', message, data);
    console.warn(`🟡 ${message}`, data || '', `Context:`, this.context);
    return entry;
  }

  error(message: string, error?: any, data?: any) {
    const entry = this.createLogEntry('error', message, { error, ...data });
    console.error(`🔴 ${message}`, error || '', data || '', `Context:`, this.context);
    
    // In production, you might want to send errors to a service
    if (this.isProduction) {
      this.reportError(entry);
    }
    
    return entry;
  }

  debug(message: string, data?: any) {
    if (!this.isProduction || this.getDebugMode()) {
      const entry = this.createLogEntry('debug', message, data);
      console.debug(`🔍 ${message}`, data || '', `Context:`, this.context);
      return entry;
    }
  }

  // API call logging
  apiCall(method: string, url: string, status?: number, responseTime?: number, data?: any) {
    const message = `API ${method} ${url} ${status ? `- ${status}` : ''}`;
    this.info(message, {
      method,
      url,
      status,
      responseTime: responseTime ? `${responseTime}ms` : undefined,
      ...(data && { data })
    });
  }

  // User interaction logging
  userAction(action: string, element?: string, data?: any) {
    this.debug(`User ${action}`, {
      action,
      element,
      ...(data && { data })
    });
  }

  // Component lifecycle logging
  componentEvent(component: string, event: string, data?: any) {
    this.debug(`Component ${component} - ${event}`, data);
  }

  // Performance logging
  performance(operation: string, duration: number, data?: any) {
    this.info(`Performance: ${operation} took ${duration}ms`, {
      operation,
      duration,
      ...(data && { data })
    });
  }

  // Get all logs for debugging
  getLogs(level?: string, limit?: number) {
    let filteredLogs = level 
      ? this.logs.filter(log => log.level === level.toUpperCase())
      : this.logs;
    
    if (limit) {
      filteredLogs = filteredLogs.slice(-limit);
    }
    
    return filteredLogs;
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
    console.log('🧹 Logs cleared');
  }

  // Download logs as JSON file
  downloadLogs() {
    if (typeof window === 'undefined') return;
    
    const blob = new Blob([JSON.stringify(this.logs, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debug-logs-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Enable/disable debug mode
  setDebugMode(enabled: boolean) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('debugMode', enabled.toString());
    }
  }

  getDebugMode(): boolean {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('debugMode') === 'true';
    }
    return false;
  }

  // Report errors to external service (implement as needed)
  private reportError(logEntry: any) {
    // You can implement error reporting to services like Sentry, LogRocket, etc.
    console.log('Error reported:', logEntry);
  }
}

// Create singleton instance
const logger = new FrontendLogger();

// Performance timing utility
export const withTiming = async <T>(
  operation: string,
  fn: () => Promise<T>,
  data?: any
): Promise<T> => {
  const start = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - start;
    logger.performance(operation, duration, data);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    logger.error(`${operation} failed after ${duration}ms`, error, data);
    throw error;
  }
};

// React Hook for component debugging
export const useDebugLogger = (componentName: string) => {
  const setContext = (context: DebugContext) => {
    logger.setContext({ component: componentName, ...context });
  };

  const log = {
    info: (message: string, data?: any) => logger.info(`[${componentName}] ${message}`, data),
    warn: (message: string, data?: any) => logger.warn(`[${componentName}] ${message}`, data),
    error: (message: string, error?: any, data?: any) => logger.error(`[${componentName}] ${message}`, error, data),
    debug: (message: string, data?: any) => logger.debug(`[${componentName}] ${message}`, data),
    userAction: (action: string, data?: any) => logger.userAction(action, componentName, data),
  };

  return { log, setContext };
};

// Console commands available in F12
if (typeof window !== 'undefined') {
  console.log(`
🔧 DEBUG TOOLS AVAILABLE:
• window.debugLogger - Main logger instance
• getLogs() - Get all logs
• getLogs('ERROR') - Get logs by level
• clearLogs() - Clear all logs
• downloadLogs() - Download logs as JSON
• setDebugMode(true) - Enable debug mode
• setDebugMode(false) - Disable debug mode

Example usage in F12 console:
> getLogs('ERROR')  // See all errors
> downloadLogs()    // Download full log file
> setDebugMode(true) // Enable verbose logging
  `);
}

export default logger;
