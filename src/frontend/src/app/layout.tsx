import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ultimate Project & Brainstorm Hub",
  description: "A comprehensive, AI-powered workspace that adapts to individual and team needs - Debug Ready",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50 dark:bg-gray-900`}
      >
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const logs = [];
              const maxLogs = 1000;

              const createLogEntry = (level, message, data) => {
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
                info: (message, data) => {
                  const entry = createLogEntry('info', message, data);
                  console.log('🔵 ' + message, data || '');
                  return entry;
                },
                error: (message, error, data) => {
                  const entry = createLogEntry('error', message, { error: error, data: data });
                  console.error('🔴 ' + message, error || '', data || '');
                  return entry;
                },
                debug: (message, data) => {
                  const entry = createLogEntry('debug', message, data);
                  console.debug('🔍 ' + message, data || '');
                  return entry;
                },
                getLogs: (level, limit) => {
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
                setDebugMode: (enabled) => {
                  localStorage.setItem('debugMode', enabled.toString());
                  console.log('🔧 Debug mode ' + (enabled ? 'enabled' : 'disabled'));
                }
              };

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

              window.debugLogger = logger;
              window.getLogs = logger.getLogs;
              window.clearLogs = logger.clearLogs;
              window.downloadLogs = logger.downloadLogs;
              window.setDebugMode = logger.setDebugMode;
              window.healthCheck = healthCheck;
              window.testAPI = testAPI;

              logger.info('🚀 Ultimate Project Hub Debug Tools Initialized');

              console.log('🚀 ULTIMATE PROJECT HUB - F12 DEBUG TOOLS READY!');
              console.log('');
              console.log('COMMANDS:');
              console.log('• getLogs() - Get all logs');
              console.log('• getLogs(\\'ERROR\\') - Get error logs only');
              console.log('• clearLogs() - Clear log history');
              console.log('• downloadLogs() - Download logs as JSON');
              console.log('• setDebugMode(true/false) - Toggle debug mode');
              console.log('• healthCheck() - Test backend health');
              console.log('• testAPI() - Test all API endpoints');
              console.log('');
              console.log('EXAMPLES:');
              console.log('> healthCheck()          // Check backend status');
              console.log('> testAPI()             // Test all endpoints');
              console.log('> getLogs(\\'ERROR\\')      // See errors only');
              console.log('> downloadLogs()        // Download debug file');
              console.log('');
              console.log('Backend: https://brainstorm-production-fdab.up.railway.app');
              console.log('Frontend: ' + window.location.origin);

              setTimeout(() => {
                healthCheck().catch(() => {
                  console.warn('⚠️ Backend may still be starting...');
                });
              }, 1000);
            })();
          `
        }} />
        {children}
      </body>
    </html>
  );
}