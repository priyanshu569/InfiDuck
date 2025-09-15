import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  Bell, 
  CheckCircle, 
  Clock,
  X,
  Eye
} from "lucide-react";

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

const AlertPanel = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'critical',
      title: 'Signal Failure',
      message: 'Signal malfunction detected at Junction B-2',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      acknowledged: false
    },
    {
      id: '2', 
      type: 'warning',
      title: 'Speed Limit',
      message: 'TR-002 exceeding speed limit in Section A-1',
      timestamp: new Date(Date.now() - 12 * 60 * 1000),
      acknowledged: false
    },
    {
      id: '3',
      type: 'info',
      title: 'Maintenance Scheduled',
      message: 'Track maintenance scheduled for Section C-1 at 14:00',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      acknowledged: true
    }
  ]);

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, acknowledged: true }
        : alert
    ));
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const getAlertStyle = (type: string, acknowledged: boolean) => {
    if (acknowledged) return 'bg-muted/50 border-muted';
    
    switch (type) {
      case 'critical': return 'bg-destructive/10 border-destructive/30 shadow-glow-alert';
      case 'warning': return 'bg-warning/10 border-warning/30';
      case 'info': return 'bg-primary/10 border-primary/30';
      default: return 'bg-muted border-border';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'info': return <Bell className="h-4 w-4 text-primary" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const unacknowledgedCount = alerts.filter(alert => !alert.acknowledged).length;

  return (
    <Card className="dashboard-card">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">System Alerts</h3>
          {unacknowledgedCount > 0 && (
            <Badge className="status-alert animate-pulse-alert">
              <Bell className="h-3 w-3 mr-1" />
              {unacknowledgedCount} New
            </Badge>
          )}
        </div>

        {/* Alerts List */}
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {alerts.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-success" />
              <p className="text-sm">All systems operational</p>
            </div>
          ) : (
            alerts.map(alert => (
              <div 
                key={alert.id}
                className={`p-3 rounded-lg border-2 transition-all duration-300 ${getAlertStyle(alert.type, alert.acknowledged)}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      {getAlertIcon(alert.type)}
                      <span className="font-medium text-sm text-foreground">
                        {alert.title}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatTimestamp(alert.timestamp)}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {alert.message}
                    </p>
                  </div>
                  
                  <div className="flex gap-1">
                    {!alert.acknowledged && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="h-6 w-6 p-0"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissAlert(alert.id)}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        {alerts.length > 0 && (
          <div className="pt-3 border-t border-border text-xs text-muted-foreground">
            Total: {alerts.length} alerts • {unacknowledgedCount} unacknowledged
          </div>
        )}
      </div>
    </Card>
  );
};

export default AlertPanel;