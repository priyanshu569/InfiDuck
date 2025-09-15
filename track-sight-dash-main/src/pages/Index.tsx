import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Train, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Activity,
  Users,
  MapPin,
  Settings,
  Bell
} from "lucide-react";
import TrackVisualization from "@/components/TrackVisualization";
import TrainStatusCard from "@/components/TrainStatusCard";
import AlertPanel from "@/components/AlertPanel";
import MetricsPanel from "@/components/MetricsPanel";
import ControlPanel from "@/components/ControlPanel";
import DragDropTimelinePanel from "@/components/DragDropTimelinePanel";
import AISuggestionsPanel from "@/components/AISuggestionsPanel";
import TrainMapView from "@/components/TrainMapView";
import OverridePanel from "@/components/OverridePanel";
import SimulationPanel from "@/components/SimulationPanel";

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      timeZoneName: 'short'
    });
  };

  return (
    <div className="min-h-screen bg-background font-mono">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Train className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground">Railway Control Center</h1>
            </div>
            <Badge variant="secondary" className="status-normal">
              <CheckCircle className="h-3 w-3 mr-1" />
              System Online
            </Badge>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="font-mono">{formatTime(currentTime)}</span>
            </div>
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="p-6 space-y-6">
        {/* Live Train Map */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Live Network Map</h2>
          <TrainMapView />
        </section>

        {/* Primary Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Interactive Timeline & What-If Simulation */}
          <section className="xl:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Interactive Timeline</h2>
              <DragDropTimelinePanel />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">What-If Scenarios</h2>
              <SimulationPanel />
            </div>
          </section>

          {/* AI Insights & Override Panel */}
          <section className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">AI Recommendations</h2>
              <AISuggestionsPanel />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Manual Override</h2>
              <OverridePanel />
            </div>
          </section>
        </div>

        {/* Secondary Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Track Status */}
          <section className="xl:col-span-2">
            <h2 className="text-lg font-semibold text-foreground mb-4">Track Status</h2>
            <TrackVisualization />
          </section>

          {/* Train Status */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground mb-4">Active Trains</h2>
            <div className="space-y-3">
              <TrainStatusCard 
                trainId="TR-001"
                status="on-time"
                speed={95}
                location="Section A-2"
                destination="Central Station"
                delay={0}
              />
              <TrainStatusCard 
                trainId="TR-002"
                status="delayed"
                speed={72}
                location="Section B-1"
                destination="North Junction" 
                delay={5}
              />
              <TrainStatusCard 
                trainId="TR-003"
                status="maintenance"
                speed={0}
                location="Depot"
                destination="Maintenance Bay"
                delay={0}
              />
            </div>
          </section>

          {/* System Panels */}
          <section className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">System Alerts</h2>
              <AlertPanel />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">KPIs & Metrics</h2>
              <MetricsPanel />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">System Controls</h2>
              <ControlPanel />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;