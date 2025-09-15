import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Route,
  Timer,
  CheckCircle,
  X,
  Lightbulb,
  Zap,
  Target
} from "lucide-react";

interface AISuggestion {
  id: string;
  type: 'optimization' | 'warning' | 'maintenance' | 'scheduling' | 'predictive' | 'efficiency';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  confidence: number;
  acknowledged: boolean;
  timestamp: Date;
  actionable: boolean;
  estimatedSavings?: string;
}

const AISuggestionsPanel = () => {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([
    {
      id: '1',
      type: 'optimization',
      priority: 'high',
      title: 'Real-time Route Optimization',
      description: 'TR-002 can save 3 minutes by switching to Track B-3 at Junction Alpha. AI detected reduced congestion on alternative route.',
      impact: 'Reduce overall delay by 15%',
      confidence: 92,
      acknowledged: false,
      timestamp: new Date(Date.now() - 300000),
      actionable: true,
      estimatedSavings: '3min, $1,200'
    },
    {
      id: '2', 
      type: 'predictive',
      priority: 'critical',
      title: 'Weather Impact Prediction',
      description: 'Heavy rain expected in 45 minutes. AI recommends immediate speed restrictions on outdoor sections A-2 through A-7.',
      impact: 'Prevent potential delays & safety risks',
      confidence: 96,
      acknowledged: false,
      timestamp: new Date(Date.now() - 600000),
      actionable: true,
      estimatedSavings: 'Safety + 8min delays prevented'
    },
    {
      id: '3',
      type: 'maintenance',
      priority: 'medium',
      title: 'Predictive Maintenance Alert',
      description: 'ML analysis detected unusual vibration patterns on Track A-2. Recommend maintenance within 72 hours to prevent failure.',
      impact: 'Avoid emergency repairs & service disruption',
      confidence: 84,
      acknowledged: false,
      timestamp: new Date(Date.now() - 900000),
      actionable: true,
      estimatedSavings: '$15,000 emergency costs avoided'
    },
    {
      id: '4',
      type: 'efficiency',
      priority: 'low',
      title: 'Dynamic Capacity Optimization',
      description: 'Platform 3 shows 23% utilization vs 87% on Platform 1. AI suggests rerouting TR-005 and TR-008 for balanced load.',
      impact: 'Improve passenger flow & platform efficiency',
      confidence: 79,
      acknowledged: true,
      timestamp: new Date(Date.now() - 1200000),
      actionable: false,
      estimatedSavings: '15% efficiency gain'
    },
    {
      id: '5',
      type: 'optimization',
      priority: 'high',
      title: 'Energy Consumption Alert',
      description: 'Current train spacing allows for regenerative braking optimization. Adjust TR-003 timing by 30 seconds.',
      impact: 'Reduce energy costs by 12%',
      confidence: 88,
      acknowledged: false,
      timestamp: new Date(Date.now() - 180000),
      actionable: true,
      estimatedSavings: '$800/day energy savings'
    }
  ]);

  // Simulate new suggestions
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newSuggestion: AISuggestion = {
          id: Date.now().toString(),
          type: ['optimization', 'predictive', 'efficiency'][Math.floor(Math.random() * 3)] as any,
          priority: ['critical', 'high', 'medium'][Math.floor(Math.random() * 3)] as any,
          title: 'New AI Insight Available',
          description: 'Real-time ML analysis has identified a new optimization opportunity based on current traffic patterns.',
          impact: 'Performance improvement',
          confidence: 70 + Math.floor(Math.random() * 25),
          acknowledged: false,
          timestamp: new Date(),
          actionable: true,
          estimatedSavings: `${Math.floor(Math.random() * 5) + 1}min savings`
        };
        
        setSuggestions(prev => [newSuggestion, ...prev.slice(0, 9)]);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const acknowledgeSuggestion = (id: string) => {
    setSuggestions(prev => prev.map(suggestion =>
      suggestion.id === id 
        ? { ...suggestion, acknowledged: true }
        : suggestion
    ));
  };

  const dismissSuggestion = (id: string) => {
    setSuggestions(prev => prev.filter(suggestion => suggestion.id !== id));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'optimization': return <TrendingUp className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'maintenance': return <Route className="h-4 w-4" />;
      case 'scheduling': return <Timer className="h-4 w-4" />;
      case 'predictive': return <Zap className="h-4 w-4" />;
      case 'efficiency': return <Target className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-destructive/30 text-destructive border-destructive/50 pulse';
      case 'high': return 'bg-warning/20 text-warning border-warning/30';
      case 'medium': return 'bg-primary/20 text-primary border-primary/30';
      case 'low': return 'bg-muted/20 text-muted-foreground border-muted/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const unacknowledgedCount = suggestions.filter(s => !s.acknowledged).length;

  return (
    <Card className="dashboard-card">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">AI Insights</h3>
          </div>
          {unacknowledgedCount > 0 && (
            <Badge className="bg-warning/20 text-warning border-warning/30 pulse">
              {unacknowledgedCount} new
            </Badge>
          )}
        </div>

        <ScrollArea className="h-[400px]">
          <div className="space-y-3">
            {suggestions.map((suggestion) => (
              <div 
                key={suggestion.id} 
                className={`p-3 rounded-lg border transition-all duration-300 ${
                  suggestion.acknowledged 
                    ? 'bg-secondary/5 border-border/50 opacity-75' 
                    : 'bg-secondary/10 border-border'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`${
                      suggestion.type === 'warning' ? 'text-warning' :
                      suggestion.type === 'predictive' ? 'text-warning' :
                      suggestion.type === 'optimization' ? 'text-success' :
                      suggestion.type === 'efficiency' ? 'text-success' :
                      'text-primary'
                    }`}>
                      {getTypeIcon(suggestion.type)}
                    </span>
                    <Badge className={`text-xs ${getPriorityColor(suggestion.priority)}`}>
                      {suggestion.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    {!suggestion.acknowledged && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => acknowledgeSuggestion(suggestion.id)}
                        className="h-6 w-6 p-0"
                      >
                        <CheckCircle className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => dismissSuggestion(suggestion.id)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-foreground text-sm">
                    {suggestion.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {suggestion.description}
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-success">Impact: {suggestion.impact}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          {suggestion.confidence}% confidence
                        </span>
                        <span className="text-muted-foreground">
                          {formatTimestamp(suggestion.timestamp)}
                        </span>
                      </div>
                    </div>
                    {suggestion.estimatedSavings && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-primary font-medium">Est. Savings: {suggestion.estimatedSavings}</span>
                        {suggestion.actionable && (
                          <Badge variant="outline" className="text-xs h-4 px-1">
                            Actionable
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="pt-4 border-t border-border">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Accuracy</div>
              <div className="text-lg font-bold text-success">94.2%</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Implemented</div>
              <div className="text-lg font-bold text-primary">67%</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Savings</div>
              <div className="text-lg font-bold text-warning">12m</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AISuggestionsPanel;