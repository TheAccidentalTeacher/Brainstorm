// Enhanced logging utility for production debugging

interface LogContext {
  requestId?: string;
  userId?: string;
  action?: string;
  endpoint?: string;
  method?: string;
  ip?: string;
  userAgent?: string;
  timestamp?: string;
  environment?: string;
  [key: string]: any;
}

class Logger {
  private context: LogContext = {};
  private environment: string;

  constructor() {
    this.environment = process.env.NODE_ENV || 'development';
  }

  setContext(context: LogContext) {
    this.context = { ...this.context, ...context };
  }

  private formatMessage(level: string, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      environment: this.environment,
      message,
      context: this.context,
      ...(data && { data }),
    };

    // In production, use structured JSON logging for better parsing
    if (this.environment === 'production') {
      return JSON.stringify(logEntry, null, 0);
    } else {
      // In development, use human-readable format
      return `[${timestamp}] ${level.toUpperCase()}: ${message} ${data ? JSON.stringify(data, null, 2) : ''} ${Object.keys(this.context).length > 0 ? `Context: ${JSON.stringify(this.context, null, 2)}` : ''}`;
    }
  }

  info(message: string, data?: any) {
    console.log(this.formatMessage('info', message, data));
  }

  warn(message: string, data?: any) {
    console.warn(this.formatMessage('warn', message, data));
  }

  error(message: string, error?: any, data?: any) {
    const errorData = {
      ...(data || {}),
      ...(error && {
        error: {
          message: error.message || error,
          stack: error.stack,
          code: error.code,
          name: error.name,
        }
      })
    };
    console.error(this.formatMessage('error', message, errorData));
  }

  debug(message: string, data?: any) {
    if (this.environment === 'development' || process.env.DEBUG_MODE === 'true') {
      console.debug(this.formatMessage('debug', message, data));
    }
  }

  // Database operation logging
  dbOperation(operation: string, collection: string, data?: any) {
    this.info(`Database ${operation}`, {
      collection,
      operation,
      ...(data && { data })
    });
  }

  // API request logging
  apiRequest(method: string, endpoint: string, statusCode?: number, responseTime?: number, data?: any) {
    this.info(`API ${method} ${endpoint}`, {
      method,
      endpoint,
      statusCode,
      responseTime: responseTime ? `${responseTime}ms` : undefined,
      ...(data && { data })
    });
  }

  // Authentication logging
  auth(action: string, userId?: string, success: boolean = true, data?: any) {
    const level = success ? 'info' : 'warn';
    this[level](`Auth ${action}`, {
      action,
      userId,
      success,
      ...(data && { data })
    });
  }

  // Performance logging
  performance(operation: string, duration: number, data?: any) {
    this.info(`Performance: ${operation}`, {
      operation,
      duration: `${duration}ms`,
      ...(data && { data })
    });
  }
}

// Singleton logger instance
const logger = new Logger();

// Express middleware for request logging
export const requestLogger = (req: any, res: any, next: any) => {
  const start = Date.now();
  const requestId = Math.random().toString(36).substring(7);
  
  // Set request context
  logger.setContext({
    requestId,
    method: req.method,
    endpoint: req.path,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
  });

  // Log incoming request
  logger.apiRequest(req.method, req.path, undefined, undefined, {
    query: req.query,
    params: req.params,
    // Don't log sensitive data like passwords
    body: req.body && typeof req.body === 'object' 
      ? Object.keys(req.body).reduce((acc, key) => {
          if (!['password', 'token', 'secret'].some(sensitive => key.toLowerCase().includes(sensitive))) {
            acc[key] = req.body[key];
          } else {
            acc[key] = '[REDACTED]';
          }
          return acc;
        }, {} as any)
      : req.body
  });

  // Log response
  const originalSend = res.send;
  res.send = function(body: any) {
    const duration = Date.now() - start;
    logger.apiRequest(req.method, req.path, res.statusCode, duration);
    
    // Clear request context
    logger.setContext({});
    
    return originalSend.call(this, body);
  };

  next();
};

export default logger;
