import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Train, 
  MapPin, 
  Navigation, 
  ZoomIn, 
  ZoomOut,
  Layers,
  AlertTriangle
} from "lucide-react";

interface MapTrain {
  id: string;
  x: number;
  y: number;
  direction: number; // 0-360 degrees
  speed: number;
  status: 'normal' | 'delayed' | 'maintenance' | 'emergency';
}

interface MapStation {
  id: string;
  name: string;
  x: number;
  y: number;
  type: 'terminal' | 'junction' | 'platform';
  status: 'normal' | 'congested' | 'closed';
}

const TrainMapView = () => {
  const [trains, setTrains] = useState<MapTrain[]>([
    { id: 'TR-001', x: 150, y: 100, direction: 45, speed: 95, status: 'normal' },
    { id: 'TR-002', x: 300, y: 180, direction: 135, speed: 72, status: 'delayed' },
    { id: 'TR-003', x: 80, y: 250, direction: 0, speed: 0, status: 'maintenance' },
    { id: 'TR-004', x: 420, y: 120, direction: 270, speed: 88, status: 'normal' }
  ]);

  const [stations] = useState<MapStation[]>([
    { id: 'ST-01', name: 'Central', x: 200, y: 150, type: 'terminal', status: 'normal' },
    { id: 'ST-02', name: 'North Jct', x: 350, y: 80, type: 'junction', status: 'congested' },
    { id: 'ST-03', name: 'South', x: 150, y: 300, type: 'platform', status: 'normal' },
    { id: 'ST-04', name: 'East Term', x: 450, y: 200, type: 'terminal', status: 'normal' },
    { id: 'ST-05', name: 'West Yard', x: 50, y: 180, type: 'platform', status: 'closed' }
  ]);

  const [selectedTrain, setSelectedTrain] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  // Simulate train movement
  useEffect(() => {
    const interval = setInterval(() => {
      setTrains(prev => prev.map(train => {
        if (train.status === 'maintenance') return train;
        
        const speed = train.speed / 100;
        const radians = (train.direction * Math.PI) / 180;
        const newX = train.x + Math.cos(radians) * speed;
        const newY = train.y + Math.sin(radians) * speed;
        
        // Keep trains within bounds and add some random movement
        const boundedX = Math.max(20, Math.min(480, newX));
        const boundedY = Math.max(20, Math.min(320, newY));
        
        return {
          ...train,
          x: boundedX,
          y: boundedY,
          direction: train.direction + (Math.random() - 0.5) * 10
        };
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getTrainColor = (status: string) => {
    switch (status) {
      case 'normal': return 'fill-success stroke-success';
      case 'delayed': return 'fill-warning stroke-warning'; 
      case 'maintenance': return 'fill-muted stroke-muted';
      case 'emergency': return 'fill-destructive stroke-destructive animate-pulse';
      default: return 'fill-primary stroke-primary';
    }
  };

  const getStationColor = (status: string, type: string) => {
    const baseColor = status === 'normal' ? 'primary' : 
                     status === 'congested' ? 'warning' : 'destructive';
    const size = type === 'terminal' ? 'w-4 h-4' : 'w-3 h-3';
    return `${size} fill-${baseColor} stroke-${baseColor}`;
  };

  return (
    <Card className="dashboard-card">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Live Network Map</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => setZoom(Math.max(0.5, zoom - 0.2))}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground font-mono">
              {Math.round(zoom * 100)}%
            </span>
            <Button size="sm" variant="ghost" onClick={() => setZoom(Math.min(2, zoom + 0.2))}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost">
              <Layers className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Map Canvas */}
        <div className="relative">
          <svg 
            width="100%" 
            height="340" 
            viewBox="0 0 500 340"
            className="bg-secondary/5 rounded-lg border border-border"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
          >
            {/* Grid */}
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Track Lines */}
            <g className="tracks">
              <path d="M 50 150 Q 200 100 350 150 Q 450 200 480 150" 
                    fill="none" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth="3" 
                    opacity="0.6" />
              <path d="M 50 200 L 200 200 L 350 150 L 450 200" 
                    fill="none" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth="3" 
                    opacity="0.6" />
              <path d="M 200 50 L 200 300" 
                    fill="none" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth="2" 
                    opacity="0.4" />
            </g>

            {/* Stations */}
            {stations.map((station) => (
              <g key={station.id}>
                <circle
                  cx={station.x}
                  cy={station.y}
                  r={station.type === 'terminal' ? 8 : 6}
                  className={`${getStationColor(station.status, station.type)} stroke-2`}
                />
                <text
                  x={station.x}
                  y={station.y - 15}
                  textAnchor="middle"
                  className="fill-current text-xs font-medium"
                  fill="hsl(var(--foreground))"
                >
                  {station.name}
                </text>
                {station.status === 'congested' && (
                  <AlertTriangle 
                    x={station.x + 10} 
                    y={station.y - 10} 
                    width="12" 
                    height="12" 
                    className="fill-warning animate-pulse" 
                  />
                )}
              </g>
            ))}

            {/* Trains */}
            {trains.map((train) => (
              <g key={train.id}>
                <circle
                  cx={train.x}
                  cy={train.y}
                  r="6"
                  className={`${getTrainColor(train.status)} stroke-2 cursor-pointer transition-all hover:r-8`}
                  onClick={() => setSelectedTrain(selectedTrain === train.id ? null : train.id)}
                />
                <text
                  x={train.x}
                  y={train.y + 20}
                  textAnchor="middle"
                  className="fill-current text-xs font-mono"
                  fill="hsl(var(--foreground))"
                >
                  {train.id}
                </text>
                {train.speed > 0 && (
                  <line
                    x1={train.x}
                    y1={train.y}
                    x2={train.x + Math.cos((train.direction * Math.PI) / 180) * 15}
                    y2={train.y + Math.sin((train.direction * Math.PI) / 180) * 15}
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                  />
                )}
              </g>
            ))}

            {/* Arrow marker */}
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                      refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--primary))" />
              </marker>
            </defs>
          </svg>

          {/* Train Details Overlay */}
          {selectedTrain && (
            <div className="absolute top-4 right-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 min-w-48">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{selectedTrain}</Badge>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => setSelectedTrain(null)}
                    className="h-6 w-6 p-0"
                  >
                    ×
                  </Button>
                </div>
                {trains
                  .filter(t => t.id === selectedTrain)
                  .map(train => (
                    <div key={train.id} className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Speed:</span>
                        <span className="font-mono">{train.speed} km/h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge className={getTrainColor(train.status).includes('success') ? 'status-normal' : 
                                        getTrainColor(train.status).includes('warning') ? 'bg-warning/20 text-warning' : 
                                        'bg-destructive/20 text-destructive'}>
                          {train.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Position:</span>
                        <span className="font-mono">
                          {Math.round(train.x)}, {Math.round(train.y)}
                        </span>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          )}
        </div>

        {/* Map Legend */}
        <div className="flex flex-wrap gap-4 pt-4 border-t border-border text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success"></div>
            <span className="text-muted-foreground">Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warning"></div>
            <span className="text-muted-foreground">Delayed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive"></div>
            <span className="text-muted-foreground">Emergency</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-3 w-3 text-primary" />
            <span className="text-muted-foreground">Stations</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TrainMapView;
