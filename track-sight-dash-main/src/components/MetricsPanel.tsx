import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Users, 
  Gauge, 
  Clock, 
  TrendingUp,
  TrendingDown,
  CheckCircle
} from "lucide-react";

interface Metric {
  label: string;
  value: number;
  unit: string;
  change: number; // percentage change
  icon: React.ReactNode;
  color: string;
}

const MetricsPanel = () => {
  const [metrics, setMetrics] = useState<Metric[]>([
    {
      label: 'Active Trains',
      value: 12,
      unit: '',
      change: +8.3,
      icon: <Users className="h-4 w-4" />,
      color: 'text-primary'
    },
    {
      label: 'Avg Speed',
      value: 87,
      unit: 'km/h',
      change: +2.1,
      icon: <Gauge className="h-4 w-4" />,
      color: 'text-success'
    },
    {
      label: 'On-Time %',
      value: 94.2,
      unit: '%',
      change: -1.2,
      icon: <Clock className="h-4 w-4" />,
      color: 'text-warning'
    },
    {
      label: 'System Health',
      value: 98.7,
      unit: '%',
      change: +0.5,
      icon: <Activity className="h-4 w-4" />,
      color: 'text-success'
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: metric.label === 'Active Trains' 
          ? Math.floor(Math.random() * 3) + 10 // 10-12 trains
          : metric.value + (Math.random() - 0.5) * 2, // Small fluctuation
        change: (Math.random() - 0.5) * 5 // Random change between -2.5 and +2.5
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatValue = (value: number, unit: string) => {
    if (unit === '%') {
      return `${value.toFixed(1)}${unit}`;
    }
    if (unit === '') {
      return Math.round(value).toString();
    }
    return `${Math.round(value)}${unit}`;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-success';
    if (change < 0) return 'text-destructive';
    return 'text-muted-foreground';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-3 w-3" />;
    if (change < 0) return <TrendingDown className="h-3 w-3" />;
    return null;
  };

  return (
    <Card className="dashboard-card">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">System Metrics</h3>
        </div>

        {/* Metrics Grid */}
        <div className="space-y-4">
          {metrics.map((metric, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={metric.color}>{metric.icon}</span>
                  <span className="text-sm text-muted-foreground">{metric.label}</span>
                </div>
                <div className="text-right">
                  <div className="metric-value">
                    {formatValue(metric.value, metric.unit)}
                  </div>
                  <div className={`flex items-center gap-1 text-xs ${getChangeColor(metric.change)}`}>
                    {getChangeIcon(metric.change)}
                    {Math.abs(metric.change).toFixed(1)}%
                  </div>
                </div>
              </div>
              
              {/* Progress bar for percentage metrics */}
              {metric.unit === '%' && (
                <Progress 
                  value={metric.value} 
                  className="h-2"
                />
              )}
            </div>
          ))}
        </div>

        {/* Status Summary */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-success">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">All systems operational</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default MetricsPanel;