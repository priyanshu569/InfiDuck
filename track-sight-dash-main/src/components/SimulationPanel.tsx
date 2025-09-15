import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Route,
  Clock,
  Zap
} from "lucide-react";

interface Scenario {
  id: string;
  name: string;
  type: 'delay' | 'reroute' | 'maintenance' | 'weather';
  trainId: string;
  station: string;
  delayMinutes?: number;
  alternateRoute?: string;
  impact: {
    cascadeDelays: number;
    affectedTrains: number;
    totalDelay: number;
    costImpact: string;
  };
  status: 'pending' | 'running' | 'completed';
}

const SimulationPanel = () => {
  const [scenarios, setScenarios] = useState<Scenario[]>([
    {
      id: '1',
      name: 'TR-001 Delay Simulation',
      type: 'delay',
      trainId: 'TR-001',
      station: 'Junction Alpha',
      delayMinutes: 10,
      impact: {
        cascadeDelays: 3,
        affectedTrains: 5,
        totalDelay: 25,
        costImpact: '$2,500'
      },
      status: 'completed'
    },
    {
      id: '2',
      name: 'Track B-2 Maintenance',
      type: 'maintenance',
      trainId: 'TR-002',
      station: 'Central Hub',
      alternateRoute: 'Track C-1',
      impact: {
        cascadeDelays: 7,
        affectedTrains: 12,
        totalDelay: 45,
        costImpact: '$8,900'
      },
      status: 'running'
    }
  ]);

  const [newScenario, setNewScenario] = useState({
    type: 'delay',
    trainId: '',
    station: '',
    delayMinutes: 5,
    alternateRoute: ''
  });

  const [isSimulating, setIsSimulating] = useState(false);

  const runScenario = (scenarioId: string) => {
    setScenarios(prev => prev.map(scenario =>
      scenario.id === scenarioId
        ? { ...scenario, status: 'running' as const }
        : scenario
    ));
    setIsSimulating(true);

    // Simulate completion after 3 seconds
    setTimeout(() => {
      setScenarios(prev => prev.map(scenario =>
        scenario.id === scenarioId
          ? { ...scenario, status: 'completed' as const }
          : scenario
      ));
      setIsSimulating(false);
    }, 3000);
  };

  const createScenario = () => {
    if (!newScenario.trainId || !newScenario.station) return;

    const scenario: Scenario = {
      id: Date.now().toString(),
      name: `${newScenario.trainId} ${newScenario.type} Simulation`,
      type: newScenario.type as any,
      trainId: newScenario.trainId,
      station: newScenario.station,
      delayMinutes: newScenario.delayMinutes,
      alternateRoute: newScenario.alternateRoute,
      impact: {
        cascadeDelays: Math.floor(Math.random() * 10) + 1,
        affectedTrains: Math.floor(Math.random() * 15) + 3,
        totalDelay: Math.floor(Math.random() * 60) + 10,
        costImpact: `$${(Math.random() * 10000 + 1000).toFixed(0)}`
      },
      status: 'pending'
    };

    setScenarios(prev => [scenario, ...prev]);
    setNewScenario({
      type: 'delay',
      trainId: '',
      station: '',
      delayMinutes: 5,
      alternateRoute: ''
    });
  };

  const resetScenarios = () => {
    setScenarios(prev => prev.map(scenario => ({
      ...scenario,
      status: 'pending' as const
    })));
    setIsSimulating(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'delay': return <Clock className="h-4 w-4" />;
      case 'reroute': return <Route className="h-4 w-4" />;
      case 'maintenance': return <AlertTriangle className="h-4 w-4" />;
      case 'weather': return <Zap className="h-4 w-4" />;
      default: return <Play className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-warning/20 text-warning border-warning/30 pulse';
      case 'completed': return 'bg-success/20 text-success border-success/30';
      case 'pending': return 'bg-muted/20 text-muted-foreground border-muted/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  return (
    <Card className="dashboard-card">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Play className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">What-If Scenarios</h3>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={resetScenarios}
            disabled={isSimulating}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset All
          </Button>
        </div>

        {/* Create New Scenario */}
        <div className="p-3 bg-secondary/5 rounded-lg border border-border space-y-3">
          <h4 className="text-sm font-medium text-foreground">Create Scenario</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="scenario-type" className="text-xs">Type</Label>
              <Select
                value={newScenario.type}
                onValueChange={(value) => setNewScenario(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delay">Delay</SelectItem>
                  <SelectItem value="reroute">Reroute</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="weather">Weather</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="train-id" className="text-xs">Train ID</Label>
              <Input
                id="train-id"
                placeholder="TR-001"
                value={newScenario.trainId}
                onChange={(e) => setNewScenario(prev => ({ ...prev, trainId: e.target.value }))}
                className="h-8"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="station" className="text-xs">Station</Label>
              <Input
                id="station"
                placeholder="Central Station"
                value={newScenario.station}
                onChange={(e) => setNewScenario(prev => ({ ...prev, station: e.target.value }))}
                className="h-8"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="delay" className="text-xs">
                {newScenario.type === 'delay' ? 'Delay (min)' : 'Impact Level'}
              </Label>
              <Input
                id="delay"
                type="number"
                value={newScenario.delayMinutes}
                onChange={(e) => setNewScenario(prev => ({ ...prev, delayMinutes: parseInt(e.target.value) || 5 }))}
                className="h-8"
              />
            </div>
          </div>

          <Button
            size="sm"
            onClick={createScenario}
            disabled={!newScenario.trainId || !newScenario.station || isSimulating}
            className="w-full"
          >
            Create & Simulate
          </Button>
        </div>

        {/* Scenarios List */}
        <ScrollArea className="h-[300px]">
          <div className="space-y-3">
            {scenarios.map((scenario) => (
              <div 
                key={scenario.id} 
                className="p-3 bg-secondary/10 rounded-lg border border-border"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-primary">
                      {getTypeIcon(scenario.type)}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {scenario.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${getStatusColor(scenario.status)}`}>
                      {scenario.status.toUpperCase()}
                    </Badge>
                    {scenario.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => runScenario(scenario.id)}
                        disabled={isSimulating}
                        className="h-6 px-2"
                      >
                        {isSimulating ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Train: {scenario.trainId}</div>
                    <div className="text-muted-foreground">Station: {scenario.station}</div>
                    {scenario.delayMinutes && (
                      <div className="text-muted-foreground">Delay: {scenario.delayMinutes}m</div>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-warning" />
                      <span className="text-warning">{scenario.impact.cascadeDelays} cascade delays</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 text-destructive" />
                      <span className="text-destructive">{scenario.impact.affectedTrains} trains affected</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span>Total delay: {scenario.impact.totalDelay}m</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingDown className="h-3 w-3 text-warning" />
                      <span>Cost: {scenario.impact.costImpact}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="pt-4 border-t border-border">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Scenarios Run</div>
              <div className="text-lg font-bold text-primary">
                {scenarios.filter(s => s.status === 'completed').length}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Avg Impact</div>
              <div className="text-lg font-bold text-warning">
                {scenarios.length > 0 
                  ? Math.round(scenarios.reduce((acc, s) => acc + s.impact.totalDelay, 0) / scenarios.length)
                  : 0}m
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Cost Impact</div>
              <div className="text-lg font-bold text-destructive">
                ${scenarios.reduce((acc, s) => acc + parseInt(s.impact.costImpact.replace('$', '').replace(',', '')), 0).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SimulationPanel;