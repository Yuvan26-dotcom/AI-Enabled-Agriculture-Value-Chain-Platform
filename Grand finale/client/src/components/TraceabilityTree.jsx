import React from 'react';
import { Sprout, Truck, Factory, ShoppingBag, CheckCircle, Clock, MapPin } from 'lucide-react';

const TraceabilityTree = ({ history }) => {
  if (!history || history.length === 0) return <div className="text-gray-500 italic p-4">No traceability data available yet.</div>;

  const getIcon = (action) => {
    switch (action) {
      case 'HARVEST_SOLD': return <Sprout size={20} />;
      case 'SHIPMENT_CREATED': return <Truck size={20} />;
      case 'PROCESSED': return <Factory size={20} />;
      case 'RETAIL_READY': return <ShoppingBag size={20} />;
      default: return <CheckCircle size={20} />;
    }
  };

  const getColor = (action) => {
    switch (action) {
      case 'HARVEST_SOLD': return 'bg-green-100 text-green-600 border-green-200';
      case 'SHIPMENT_CREATED': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'PROCESSED': return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'RETAIL_READY': return 'bg-purple-100 text-purple-600 border-purple-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getTitle = (action) => {
      switch (action) {
          case 'HARVEST_SOLD': return 'Harvested & Sold';
          case 'SHIPMENT_CREATED': return 'Logistics Transit';
          case 'PROCESSED': return 'Processing Unit';
          case 'RETAIL_READY': return 'Ready for Retail';
          default: return action.replace('_', ' ');
      }
  }

  return (
    <div className="relative pl-8 border-l-2 border-gray-200 space-y-8 my-6 ml-4">
      {history.map((block, index) => (
        <div key={index} className="relative">
          {/* Dot on the line */}
          <div className={`absolute -left-[41px] top-0 p-2 rounded-full border-2 bg-white ${getColor(block.data.action)}`}>
            {getIcon(block.data.action)}
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-bold text-gray-800">{getTitle(block.data.action)}</h4>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <Clock size={12} /> {new Date(block.timestamp).toLocaleString()}
                </p>
              </div>
              <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">Block #{block.index}</span>
            </div>
            
            <div className="mt-2 text-sm text-gray-600 space-y-1">
              {block.data.action === 'HARVEST_SOLD' && (
                <>
                  <p><span className="font-semibold">Farmer ID:</span> {block.data.farmerId}</p>
                  <p><span className="font-semibold">Crop:</span> {block.data.crop}</p>
                  <p><span className="font-semibold">Quantity:</span> {block.data.quantity} Quintals</p>
                </>
              )}
              {block.data.action === 'PROCESSED' && (
                <>
                  <p><span className="font-semibold">Processor ID:</span> {block.data.processorId}</p>
                  <p><span className="font-semibold">Operation:</span> {block.data.details}</p>
                </>
              )}
              {block.data.action === 'SHIPMENT_CREATED' && (
                  <>
                    <p><span className="font-semibold">Tracking ID:</span> {block.data.trackingId}</p>
                    <p className="flex items-center gap-1"><MapPin size={12}/> {block.data.origin} ➔ {block.data.destination}</p>
                  </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TraceabilityTree;
