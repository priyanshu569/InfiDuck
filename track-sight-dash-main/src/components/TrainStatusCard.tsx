import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Train, 
  Clock, 
  MapPin, 
  Gauge, 
  AlertTriangle,
  CheckCircle,
  Wrench
} from "lucide-react";

interface TrainStatusCardProps {
  trainId: string;
  status: 'on-time' | 'delayed' | 'maintenance' | 'emergency';
  speed: number;
  location: string;
  destination: string;
  delay: number; // in minutes
}

const TrainStatusCard = ({ 
  trainId, 
  status, 
  speed, 
  location, 
  destination, 
  delay 
}: TrainStatusCardProps) => {
  
  const getStatusInfo = () => {
    switch (status) {
      case 'on-time':
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          label: 'On Time',
          className: 'status-normal'
        };
      case 'delayed':
        return {
          icon: <Clock className="h-4 w-4" />,
          label: `Delayed ${delay}min`,
          className: 'status-warning'
        };
      case 'maintenance':
        return {
          icon: <Wrench className="h-4 w-4" />,
          label: 'Maintenance',
          className: 'status-alert'
        };
      case 'emergency':
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          label: 'Emergency',
          className: 'status-alert animate-pulse-alert'
        };
      default:
        return {
          icon: <Train className="h-4 w-4" />,
          label: 'Unknown',
          className: 'bg-muted text-muted-foreground'
        };
    }
  };

  const statusInfo = getStatusInfo();
  const speedPercentage = Math.min((speed / 120) * 100, 100); // Assuming max speed of 120 km/h

  return (
    <Card className="dashboard-card hover:bg-card/80 transition-colors">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Train className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">{trainId}</h3>
          </div>
          <Badge className={`${statusInfo.className} transition-all`}>
            {statusInfo.icon}
            {statusInfo.label}
          </Badge>
        </div>

        {/* Speed Gauge */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Speed</span>
            </div>
            <span className="metric-value text-lg">{speed} km/h</span>
          </div>
          <Progress 
            value={speedPercentage} 
            className="h-2"
          />
        </div>

        {/* Location Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Current Location</span>
          </div>
          <p className="font-medium text-foreground">{location}</p>
        </div>

        {/* Destination */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Train className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Destination</span>
          </div>
          <p className="font-medium text-foreground">{destination}</p>
        </div>

        {/* Additional Info */}
        {delay > 0 && status === 'delayed' && (
          <div className="pt-2 border-t border-border">
            <div className="flex items-center gap-2 text-warning">
              <Clock className="h-3 w-3" />
              <span className="text-xs">Delayed by {delay} minutes</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TrainStatusCard;