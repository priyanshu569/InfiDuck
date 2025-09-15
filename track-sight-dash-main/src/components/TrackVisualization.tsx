import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Train, MapPin, AlertTriangle } from "lucide-react";

interface TrainPosition {
  id: string;
  section: string;
  position: number; // 0-100 percentage
  status: 'normal' | 'delayed' | 'maintenance';
}

interface TrackSection {
  id: string;
  name: string;
  status: 'normal' | 'occupied' | 'maintenance' | 'blocked';
  length: number;
}

const TrackVisualization = () => {
  const [trainPositions, setTrainPositions] = useState<TrainPosition[]>([
    { id: 'TR-001', section: 'A-2', position: 65, status: 'normal' },
    { id: 'TR-002', section: 'B-1', position: 30, status: 'delayed' },
    { id: 'TR-003', section: 'DEPOT', position: 0, status: 'maintenance' },
  ]);

  const trackSections: TrackSection[] = [
    { id: 'A-1', name: 'Section A-1', status: 'normal', length: 100 },
    { id: 'A-2', name: 'Section A-2', status: 'occupied', length: 100 },
    { id: 'A-3', name: 'Section A-3', status: 'normal', length: 100 },
    { id: 'B-1', name: 'Section B-1', status: 'occupied', length: 100 },
    { id: 'B-2', name: 'Section B-2', status: 'maintenance', length: 100 },
    { id: 'C-1', name: 'Section C-1', status: 'normal', length: 100 },
  ];

  // Simulate real-time train movement
  useEffect(() => {
    const interval = setInterval(() => {
      setTrainPositions(prev => prev.map(train => ({
        ...train,
        position: train.status === 'normal' ? 
          (train.position + Math.random() * 2) % 100 : 
          train.position
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-success border-green-600';
      case 'occupied': return 'bg-primary border-blue-400';
      case 'maintenance': return 'bg-warning border-yellow-400';
      case 'blocked': return 'bg-destructive border-red-400';
      default: return 'bg-muted border-gray-400';
    }
  };

  const getTrainStatusIcon = (status: string) => {
    switch (status) {
      case 'normal': return <Train className="h-3 w-3 text-green-400" />;
      case 'delayed': return <AlertTriangle className="h-3 w-3 text-yellow-400" />;
      case 'maintenance': return <MapPin className="h-3 w-3 text-red-400" />;
      default: return <Train className="h-3 w-3" />;
    }
  };

  return (
    <Card className="dashboard-card">
      <div className="space-y-6">
        {/* Track Layout */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Track Status</h3>
          
          {/* Main Line A */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-foreground">Main Line A</h4>
            <div className="flex gap-1">
              {trackSections.filter(s => s.id.startsWith('A')).map(section => (
                <div key={section.id} className="flex-1 relative">
                  <div className={`h-8 rounded border-2 ${getStatusColor(section.status)} transition-all duration-300`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-medium text-white/90">{section.name}</span>
                    </div>
                    
                    {/* Train indicators */}
                    {trainPositions
                      .filter(train => train.section === section.id)
                      .map(train => (
                        <div 
                          key={train.id}
                          className="absolute top-0 h-full flex items-center animate-train-move"
                          style={{ left: `${train.position}%` }}
                        >
                          <div className="bg-white/20 backdrop-blur-sm rounded px-1 py-0.5 border border-white/30">
                            {getTrainStatusIcon(train.status)}
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Line B */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-foreground">Main Line B</h4>
            <div className="flex gap-1">
              {trackSections.filter(s => s.id.startsWith('B')).map(section => (
                <div key={section.id} className="flex-1 relative">
                  <div className={`h-8 rounded border-2 ${getStatusColor(section.status)} transition-all duration-300`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-medium text-white/90">{section.name}</span>
                    </div>
                    
                    {/* Train indicators */}
                    {trainPositions
                      .filter(train => train.section === section.id)
                      .map(train => (
                        <div 
                          key={train.id}
                          className="absolute top-0 h-full flex items-center animate-train-move"
                          style={{ left: `${train.position}%` }}
                        >
                          <div className="bg-white/20 backdrop-blur-sm rounded px-1 py-0.5 border border-white/30">
                            {getTrainStatusIcon(train.status)}
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Auxiliary Line C */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-foreground">Service Line C</h4>
            <div className="flex gap-1">
              {trackSections.filter(s => s.id.startsWith('C')).map(section => (
                <div key={section.id} className="flex-1 relative">
                  <div className={`h-6 rounded border-2 ${getStatusColor(section.status)} transition-all duration-300`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-medium text-white/90">{section.name}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-success border border-green-600"></div>
            <span className="text-xs text-muted-foreground">Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-primary border border-blue-400"></div>
            <span className="text-xs text-muted-foreground">Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-warning border border-yellow-400"></div>
            <span className="text-xs text-muted-foreground">Maintenance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-destructive border border-red-400"></div>
            <span className="text-xs text-muted-foreground">Blocked</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TrackVisualization;