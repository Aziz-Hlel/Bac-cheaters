import * as Comlink from 'comlink';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { ExcelWorker } from '../workers/excel.worker';

interface ExcelWorkerContextValue {
  worker: Comlink.Remote<ExcelWorker> | null;
  isReady: boolean;
  resetWorker: () => Promise<void>;
}

const ExcelWorkerContext = createContext<ExcelWorkerContextValue | null>(null);

export const ExcelWorkerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [worker, setWorker] = useState<Comlink.Remote<ExcelWorker> | null>(null);
  const workerInstanceRef = useRef<Worker | null>(null);
  const isReady = worker !== null;

  useEffect(() => {
    // Instantiate the Web Worker via Vite's ESM worker loader
    const rawWorker = new Worker(new URL('../workers/excel.worker.ts', import.meta.url), { type: 'module' });
    workerInstanceRef.current = rawWorker;

    // Directly wrap the exposed ExcelWorker instance with Comlink
    const remoteWorker = Comlink.wrap<ExcelWorker>(rawWorker);
    // Since Comlink proxies are functions, wrap in an updater callback to avoid React calling remoteWorker()
    // ! eslint diabled here
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWorker(() => remoteWorker);

    return () => {
      // Clean up the Web Worker when the dialog unmounts
      rawWorker.terminate();
      workerInstanceRef.current = null;
    };
  }, []);

  const resetWorker = async () => {
    if (worker) {
      await worker.reset();
    }
  };

  return (
    <ExcelWorkerContext.Provider
      value={{
        worker,
        isReady,
        resetWorker,
      }}
    >
      {children}
    </ExcelWorkerContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useExcelWorker = () => {
  const context = useContext(ExcelWorkerContext);
  if (!context) {
    throw new Error('useExcelWorker must be used within an ExcelWorkerProvider');
  }
  return context;
};
