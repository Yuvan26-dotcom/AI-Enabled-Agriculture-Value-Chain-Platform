import React, { useState, useEffect } from 'react';
import { Brain, Activity, Server, Zap } from 'lucide-react';

const ANNLogPanel = () => {
  const [logs, setLogs] = useState([]);
  const [metrics, setMetrics] = useState({ accuracy: 0.85, loss: 0.15, epoch: 0 });

  useEffect(() => {
    const messages = [
      "Initializing Neural Network weights...",
      "Loading traffic patterns from satellite data...",
      "Normalizing distance vectors...",
      "Forward propagation: Layer 1 (ReLU)...",
      "Forward propagation: Layer 2 (Sigmoid)...",
      "Calculating loss function (MSE)...",
      "Backpropagation: Adjusting weights...",
      "Optimizing route for fuel efficiency...",
      "Predicting congestion probability...",
      "Updating heuristic values for A* search...",
      "ANN Model converged. Optimal path found."
    ];

    let msgIndex = 0;
    const interval = setInterval(() => {
      const newLog = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        message: messages[msgIndex % messages.length],
        type: msgIndex % 5 === 0 ? 'info' : 'process'
      };
      
      setLogs(prev => [newLog, ...prev].slice(0, 6));
      setMetrics(prev => ({
        accuracy: Math.min(0.99, prev.accuracy + 0.001),
        loss: Math.max(0.01, prev.loss - 0.001),
        epoch: prev.epoch + 1
      }));
      
      msgIndex++;
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black text-green-400 p-4 rounded-xl font-mono text-xs shadow-lg border border-green-800 h-full flex flex-col">
      <div className="flex justify-between items-center mb-3 border-b border-green-800 pb-2">
        <div className="flex items-center gap-2">
          <Brain size={16} className="animate-pulse" />
          <span className="font-bold">ANN_ROUTE_OPTIMIZER_V4.2</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
          <span>ONLINE</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-green-900/20 p-2 rounded border border-green-900/50">
          <div className="text-green-600 text-[10px] uppercase">Accuracy</div>
          <div className="font-bold text-lg">{(metrics.accuracy * 100).toFixed(2)}%</div>
        </div>
        <div className="bg-green-900/20 p-2 rounded border border-green-900/50">
          <div className="text-green-600 text-[10px] uppercase">Loss</div>
          <div className="font-bold text-lg">{metrics.loss.toFixed(4)}</div>
        </div>
        <div className="bg-green-900/20 p-2 rounded border border-green-900/50">
          <div className="text-green-600 text-[10px] uppercase">Epoch</div>
          <div className="font-bold text-lg">{metrics.epoch}</div>
        </div>
      </div>

      {/* Logs */}
      <div className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 overflow-y-auto space-y-1 scrollbar-hide">
          {logs.map(log => (
            <div key={log.id} className="flex gap-2 opacity-90">
              <span className="text-green-700">[{log.timestamp}]</span>
              <span className={log.type === 'info' ? 'text-blue-400' : 'text-green-400'}>
                {log.type === 'process' && '> '}
                {log.message}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-2 pt-2 border-t border-green-800 text-[10px] text-green-600 flex justify-between">
        <span>GPU: NVIDIA TESLA T4 (Simulated)</span>
        <span>Mem: 4.2GB / 16GB</span>
      </div>
    </div>
  );
};

export default ANNLogPanel;
