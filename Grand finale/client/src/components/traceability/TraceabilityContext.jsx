import React, { createContext, useContext, useState } from 'react';

const TraceabilityContext = createContext();

export const useTraceability = () => useContext(TraceabilityContext);

export const TraceabilityProvider = ({ children }) => {
  // Global State for the Demo Batch
  const [activeBatch, setActiveBatch] = useState({
    id: null,
    seedData: null,
    farmData: null,
    fpoData: null,
    warehouseData: null,
    processorData: null,
    retailerData: null,
    logs: [] // Blockchain Ledger
  });

  const addLog = (stage, action, details, hash) => {
    const newLog = {
      id: activeBatch.logs.length + 1,
      timestamp: new Date().toISOString(),
      stage,
      action,
      details,
      hash: hash || '0x' + Math.random().toString(16).substr(2, 64),
      signature: 'Valid'
    };
    setActiveBatch(prev => ({
      ...prev,
      logs: [...prev.logs, newLog]
    }));
  };

  const updateStage = (stage, data) => {
    setActiveBatch(prev => ({
      ...prev,
      [stage]: data
    }));
  };

  const resetDemo = () => {
    setActiveBatch({
      id: null,
      seedData: null,
      farmData: null,
      fpoData: null,
      warehouseData: null,
      processorData: null,
      retailerData: null,
      logs: []
    });
  };

  return (
    <TraceabilityContext.Provider value={{ activeBatch, updateStage, addLog, resetDemo, setActiveBatch }}>
      {children}
    </TraceabilityContext.Provider>
  );
};
