import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Power, 
  StopCircle, 
  PlayCircle, 
  AlertTriangle,
  Shield,
  Settings,
  Wrench,
  RefreshCw
} from "lucide-react";

interface SystemControl {
  id: string;
  label: string;
  status: boolean;
  type: 'toggle' | 'action';
  variant: 'primary' | 'secondary' | 'destructive' | 'warning';
  icon: React.ReactNode;
}

const ControlPanel = () => {
  const [controls, setControls] = useState<SystemControl[]>([
    {
      id: 'auto-signals',
      label: 'Auto Signal Control',
      status: true,
      type: 'toggle',
      variant: 'primary',
      icon: <Settings className="h-4 w-4" />
    },
    {
      id: 'emergency-brake',
      label: 'Emergency Brake System',
      status: true,
      type: 'toggle', 
      variant: 'destructive',
      icon: <Shield className="h-4 w-4" />
    },
    {
      id: 'track-monitoring',
      label: 'Track Monitoring',
      status: true,
      type: 'toggle',
      variant: 'primary',
      icon: <AlertTriangle className="h-4 w-4" />
    }
  ]);

  const [actionButtons] = useState([
    {
      id: 'emergency-stop',
      label: 'Emergency Stop All',
      variant: 'destructive' as const,
      icon: <StopCircle className="h-4 w-4" />
    },
    {
      id: 'system-reset',
      label: 'System Reset',
      variant: 'warning' as const,
      icon: <RefreshCw className="h-4 w-4" />
    },
    {
      id: 'maintenance-mode',
      label: 'Maintenance Mode',
      variant: 'secondary' as const,
      icon: <Wrench className="h-4 w-4" />
    },
    {
      id: 'resume-operations',
      label: 'Resume Operations',
      variant: 'default' as const,
      icon: <PlayCircle className="h-4 w-4" />
    }
  ]);

  const toggleControl = (controlId: string) => {
    setControls(prev => prev.map(control => 
      control.id === controlId 
        ? { ...control, status: !control.status }
        : control
    ));
  };

  const handleAction = (actionId: string) => {
    // Simulate action execution
    console.log(`Executing action: ${actionId}`);
    
    // In a real system, this would trigger actual control commands
    switch (actionId) {
      case 'emergency-stop':
        alert('Emergency stop initiated for all trains!');
        break;
      case 'system-reset':
        alert('System reset initiated...');
        break;
      case 'maintenance-mode':
        alert('Entering maintenance mode...');
        break;
      case 'resume-operations':
        alert('Resuming normal operations...');
        break;
    }
  };

  const getVariantClass = (variant: string, isActive: boolean = true) => {
    if (!isActive) return 'opacity-50';
    
    switch (variant) {
      case 'primary': return '';
      case 'destructive': return '';
      case 'warning': return '';
      case 'secondary': return '';
      default: return '';
    }
  };

  return (
    <Card className="dashboard-card">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Power className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Control Center</h3>
        </div>

        {/* System Controls */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">System Controls</h4>
          <div className="space-y-3">
            {controls.map(control => (
              <div key={control.id} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <span className={`${control.variant === 'destructive' ? 'text-destructive' : 'text-primary'}`}>
                    {control.icon}
                  </span>
                  <span className="font-medium text-foreground">{control.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={control.status ? "default" : "secondary"}
                    className={control.status ? 'status-normal' : 'bg-muted text-muted-foreground'}
                  >
                    {control.status ? 'Active' : 'Inactive'}
                  </Badge>
                  <Switch 
                    checked={control.status}
                    onCheckedChange={() => toggleControl(control.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-3">
            {actionButtons.map(action => (
              <Button
                key={action.id}
                variant={action.variant}
                onClick={() => handleAction(action.id)}
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                {action.icon}
                <span className="text-xs font-medium">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Status Footer */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Controller: Admin User</span>
            <span className="text-muted-foreground">Session: 2h 34m</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ControlPanel;