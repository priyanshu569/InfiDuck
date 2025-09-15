import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Lock, 
  Unlock, 
  AlertTriangle, 
  Shield, 
  Settings,
  RefreshCw,
  PlayCircle,
  PauseCircle,
  SkipForward,
  Router
} from "lucide-react";

interface Override {
  id: string;
  target: string;
  type: 'speed' | 'route' | 'signal' | 'priority';
  value: string;
  duration: number; // minutes
  active: boolean;
  operator: string;
  timestamp: Date;
}

const OverridePanel = () => {
  const [isLocked, setIsLocked] = useState(true);
  const [activeOverrides, setActiveOverrides] = useState<Override[]>([
    {
      id: '1',
      target: 'TR-002',
      type: 'speed',
      value: '80 km/h',
      duration: 15,
      active: true,
      operator: 'Admin',
      timestamp: new Date(Date.now() - 300000)
    }
  ]);

  const [overrideForm, setOverrideForm] = useState({
    target: '',
    type: 'speed' as Override['type'],
    value: '',
    duration: 5
  });

  const toggleLock = () => {
    setIsLocked(!isLocked);
    if (!isLocked) {
      // Lock engaged - clear any temporary states
      setOverrideForm({
        target: '',
        type: 'speed',
        value: '',
        duration: 5
      });
    }
  };

  const executeOverride = () => {
    if (isLocked || !overrideForm.target || !overrideForm.value) return;

    const newOverride: Override = {
      id: Date.now().toString(),
      target: overrideForm.target,
      type: overrideForm.type,
      value: overrideForm.value,
      duration: overrideForm.duration,
      active: true,
      operator: 'Current User',
      timestamp: new Date()
    };

    setActiveOverrides(prev => [newOverride, ...prev]);
    setOverrideForm({
      target: '',
      type: 'speed',
      value: '',
      duration: 5
    });
  };

  const cancelOverride = (id: string) => {
    setActiveOverrides(prev => prev.filter(o => o.id !== id));
  };

  const quickActions = [
    {
      id: 'emergency-stop-all',
      label: 'Emergency Stop All',
      icon: <PauseCircle className="h-4 w-4" />,
      variant: 'destructive' as const,
      requiresUnlock: true
    },
    {
      id: 'priority-clear',
      label: 'Priority Clear Track',
      icon: <SkipForward className="h-4 w-4" />,
      variant: 'warning' as const,
      requiresUnlock: true
    },
    {
      id: 'auto-reroute',
      label: 'Auto Reroute',
      icon: <Router className="h-4 w-4" />,
      variant: 'secondary' as const,
      requiresUnlock: false
    },
    {
      id: 'resume-schedule',
      label: 'Resume Schedule',
      icon: <PlayCircle className="h-4 w-4" />,
      variant: 'default' as const,
      requiresUnlock: false
    }
  ];

  const handleQuickAction = (actionId: string) => {
    const action = quickActions.find(a => a.id === actionId);
    if (action?.requiresUnlock && isLocked) {
      alert('Manual override controls are locked. Unlock to proceed.');
      return;
    }

    switch (actionId) {
      case 'emergency-stop-all':
        alert('Emergency stop initiated for all trains!');
        break;
      case 'priority-clear':
        alert('Priority track clearing sequence started.');
        break;
      case 'auto-reroute':
        alert('Automatic rerouting enabled.');
        break;
      case 'resume-schedule':
        alert('Normal schedule operations resumed.');
        break;
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <Card className="dashboard-card">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Manual Override</h3>
          </div>
          <Button
            variant={isLocked ? "destructive" : "success"}
            size="sm"
            onClick={toggleLock}
            className="flex items-center gap-2"
          >
            {isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
            {isLocked ? 'Locked' : 'Unlocked'}
          </Button>
        </div>

        {/* Lock Warning */}
        {isLocked && (
          <div className="flex items-center gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <Shield className="h-4 w-4 text-warning" />
            <span className="text-sm text-warning">
              Manual controls locked for safety. Click unlock to enable.
            </span>
          </div>
        )}

        {/* Override Form */}
        <div className={`space-y-4 ${isLocked ? 'opacity-50 pointer-events-none' : ''}`}>
          <h4 className="text-sm font-medium text-muted-foreground">Create Override</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target" className="text-xs">Target</Label>
              <Input
                id="target"
                placeholder="TR-001, Section A-2..."
                value={overrideForm.target}
                onChange={(e) => setOverrideForm(prev => ({ ...prev, target: e.target.value }))}
                className="h-8"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type" className="text-xs">Type</Label>
              <select
                id="type"
                value={overrideForm.type}
                onChange={(e) => setOverrideForm(prev => ({ ...prev, type: e.target.value as Override['type'] }))}
                className="h-8 w-full rounded-md border border-border bg-background px-3 py-1 text-sm"
              >
                <option value="speed">Speed Limit</option>
                <option value="route">Route Change</option>
                <option value="signal">Signal Override</option>
                <option value="priority">Priority Level</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="value" className="text-xs">Value</Label>
              <Input
                id="value"
                placeholder="80 km/h, Track B-3..."
                value={overrideForm.value}
                onChange={(e) => setOverrideForm(prev => ({ ...prev, value: e.target.value }))}
                className="h-8"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-xs">Duration (min)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="120"
                value={overrideForm.duration}
                onChange={(e) => setOverrideForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 5 }))}
                className="h-8"
              />
            </div>
          </div>

          <Button
            onClick={executeOverride}
            disabled={!overrideForm.target || !overrideForm.value}
            className="w-full"
            variant="warning"
          >
            Execute Override
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant={action.variant}
                onClick={() => handleQuickAction(action.id)}
                className={`h-auto p-3 flex flex-col items-center gap-1 ${
                  action.requiresUnlock && isLocked ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={action.requiresUnlock && isLocked}
              >
                {action.icon}
                <span className="text-xs font-medium">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Active Overrides */}
        {activeOverrides.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-muted-foreground">Active Overrides</h4>
              <Badge variant="outline" className="text-xs">
                {activeOverrides.length} active
              </Badge>
            </div>
            
            <div className="space-y-2">
              {activeOverrides.map((override) => (
                <div key={override.id} className="flex items-center justify-between p-3 bg-warning/5 border border-warning/20 rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {override.target}
                      </Badge>
                      <span className="text-sm font-medium">
                        {override.type}: {override.value}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Duration: {formatDuration(override.duration)} • By: {override.operator}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => cancelOverride(override.id)}
                  >
                    <AlertTriangle className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default OverridePanel;