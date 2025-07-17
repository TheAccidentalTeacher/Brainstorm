"use client";

import { useEffect } from 'react';

export default function DebugInitializer() {
  useEffect(() => {
    // Initialize debug tools immediately
    console.log('🔧 Ultimate Project Hub - Debug Tools Loading...');
    
    // Import and initialize the debug logger
    import('../lib/debug').then((debugModule) => {
      const logger = debugModule.default;
      
      // Make global debugging functions available
      (window as any).debugLogger = logger;
      (window as any).getLogs = (level?: string, limit?: number) => logger.getLogs(level, limit);
      (window as any).clearLogs = () => logger.clearLogs();
      (window as any).downloadLogs = () => logger.downloadLogs();
      (window as any).setDebugMode = (enabled: boolean) => logger.setDebugMode(enabled);
      
      'use client';

import { useEffect } from 'react';

export default function DebugInitializer() {
  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;

    // Simple production logger
    const logs: any[] = [];
    const maxLogs = 1000;

    const createLogEntry = (level: string, message: string, data?: any) => {
      const entry = {
        timestamp: new Date().toISOString(),
        level: level.toUpperCase(),
        message,
        url: window.location.href,
        data: data || null
      };

      logs.push(entry);
      if (logs.length > maxLogs) {
        logs.shift();
      }

      return entry;
    };

    const logger = {
      info: (message: string, data?: any) => {
        const entry = createLogEntry('info', message, data);
        console.log('🔵 ' + message, data || '');
        return entry;
      },
      error: (message: string, error?: any, data?: any) => {
        const entry = createLogEntry('error', message, { error, ...data });
        console.error('🔴 ' + message, error || '', data || '');
        return entry;
      },
      debug: (message: string, data?: any) => {
        const entry = createLogEntry('debug', message, data);
        console.debug('🔍 ' + message, data || '');
        return entry;
      },
      getLogs: (level?: string, limit?: number) => {
        let filteredLogs = level 
          ? logs.filter(log => log.level === level.toUpperCase())
          : logs;
        
        if (limit) {
          filteredLogs = filteredLogs.slice(-limit);
        }
        
        return filteredLogs;
      },
      clearLogs: () => {
        logs.length = 0;
        console.log('🧹 Logs cleared');
      },
      downloadLogs: () => {
        const blob = new Blob([JSON.stringify(logs, null, 2)], {
          type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'debug-logs-' + new Date().toISOString() + '.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log('📄 Logs downloaded');
      },
      setDebugMode: (enabled: boolean) => {
        localStorage.setItem('debugMode', enabled.toString());
        console.log('🔧 Debug mode ' + (enabled ? 'enabled' : 'disabled'));
      }
    };

    // Health check function
    const healthCheck = async () => {
      try {
        logger.info('Running health check...');
        const response = await fetch('https://brainstorm-production-fdab.up.railway.app/health');
        const data = await response.json();
        logger.info('Health check successful', data);
        console.table(data);
        return data;
      } catch (error) {
        logger.error('Health check failed', error);
        throw error;
      }
    };

    // API test function
    const testAPI = async () => {
      try {
        logger.info('Testing API endpoints...');
        
        const rootResponse = await fetch('https://brainstorm-production-fdab.up.railway.app/');
        const rootData = await rootResponse.json();
        logger.info('API root test successful', rootData);
        
        await healthCheck();
        
        console.log('✅ All API tests passed');
        return { root: rootData };
      } catch (error) {
        logger.error('API test failed', error);
        throw error;
      }
    };

    // Make everything globally available
    (window as any).debugLogger = logger;
    (window as any).getLogs = logger.getLogs;
    (window as any).clearLogs = logger.clearLogs;
    (window as any).downloadLogs = logger.downloadLogs;
    (window as any).setDebugMode = logger.setDebugMode;
    (window as any).healthCheck = healthCheck;
    (window as any).testAPI = testAPI;

    logger.info('🚀 Ultimate Project Hub Debug Tools Initialized');

    // Display help message
    console.log(`
🚀 ULTIMATE PROJECT HUB - F12 DEBUG TOOLS READY!

COMMANDS:
• getLogs() - Get all logs
• getLogs('ERROR') - Get error logs only
• clearLogs() - Clear log history
• downloadLogs() - Download logs as JSON
• setDebugMode(true/false) - Toggle debug mode
• healthCheck() - Test backend health
• testAPI() - Test all API endpoints

EXAMPLES:
> healthCheck()          // Check backend status
> testAPI()             // Test all endpoints
> getLogs('ERROR')      // See errors only
> downloadLogs()        // Download debug file

Backend: https://brainstorm-production-fdab.up.railway.app
Frontend: ` + window.location.origin + `
    `);

    // Auto health check
    healthCheck().catch(() => {
      console.warn('⚠️ Backend may still be starting...');
    });

  }, []);

  return null;
}
      
      logger.info('Debug tools initialized', {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      });
    }).catch((error) => {
      console.error('Failed to load debug tools:', error);
    });
    
    // Also set up basic debugging immediately
    (window as any).debugInfo = {
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      localStorage: Object.keys(localStorage),
      sessionStorage: Object.keys(sessionStorage)
    };
    
    console.log('📊 Debug info available at window.debugInfo');
  }, []);

  return null; // This component doesn't render anything
}
