import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, MapPin, AlertTriangle, CheckCircle, GripVertical, RotateCcw } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TimelineEvent {
  id: string;
  trainId: string;
  station: string;
  scheduledTime: string;
  actualTime?: string;
  estimatedTime?: string;
  status: 'completed' | 'delayed' | 'on-time' | 'cancelled';
  delay?: number;
  originalIndex?: number;
}

interface SortableTimelineItemProps {
  event: TimelineEvent;
  onSimulate: (eventId: string) => void;
}

const SortableTimelineItem = ({ event, onSimulate }: SortableTimelineItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: event.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'delayed': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'cancelled': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default: return <Clock className="h-4 w-4 text-primary" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success/20 text-success border-success/30';
      case 'delayed': return 'bg-warning/20 text-warning border-warning/30';
      case 'cancelled': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return 'bg-primary/20 text-primary border-primary/30';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 p-3 bg-secondary/10 rounded-lg border border-border hover:bg-secondary/20 transition-colors group"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing opacity-50 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      
      <div className="flex flex-col items-center">
        {getStatusIcon(event.status)}
        <div className="w-px h-8 bg-border mt-2" />
      </div>
      
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {event.trainId}
            </Badge>
            <span className="text-sm font-medium text-foreground">
              {event.station}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`text-xs ${getStatusColor(event.status)}`}>
              {event.status.toUpperCase()}
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onSimulate(event.id)}
              className="h-6 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Simulate
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Scheduled: {event.scheduledTime}</span>
          </div>
          {event.actualTime && (
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              <span>Actual: {event.actualTime}</span>
            </div>
          )}
          {event.estimatedTime && !event.actualTime && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>Est: {event.estimatedTime}</span>
            </div>
          )}
          {event.delay && (
            <span className="text-warning">+{event.delay}min</span>
          )}
        </div>
      </div>
    </div>
  );
};

const DragDropTimelinePanel = () => {
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([
    {
      id: '1',
      trainId: 'TR-001',
      station: 'Central Station',
      scheduledTime: '14:30',
      actualTime: '14:30',
      status: 'completed',
      originalIndex: 0
    },
    {
      id: '2', 
      trainId: 'TR-001',
      station: 'Junction Alpha',
      scheduledTime: '14:45',
      actualTime: '14:47',
      status: 'delayed',
      delay: 2,
      originalIndex: 1
    },
    {
      id: '3',
      trainId: 'TR-002',
      station: 'North Terminal',
      scheduledTime: '15:15',
      estimatedTime: '15:20',
      status: 'delayed',
      delay: 5,
      originalIndex: 2
    },
    {
      id: '4',
      trainId: 'TR-001',
      station: 'South Bridge',
      scheduledTime: '15:00',
      estimatedTime: '15:02',
      status: 'on-time',
      originalIndex: 3
    }
  ]);

  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const [originalOrder, setOriginalOrder] = useState<TimelineEvent[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Simulate real-time updates (disabled during simulation mode)
  useEffect(() => {
    if (isSimulationMode) return;
    
    const interval = setInterval(() => {
      setTimelineEvents(prev => prev.map(event => {
        if (event.status === 'on-time' && Math.random() > 0.8) {
          return {
            ...event,
            estimatedTime: addMinutes(event.scheduledTime, Math.floor(Math.random() * 3)),
            status: 'delayed' as const,
            delay: Math.floor(Math.random() * 3) + 1
          };
        }
        return event;
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, [isSimulationMode]);

  const addMinutes = (time: string, minutes: number) => {
    const [hours, mins] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, mins + minutes);
    return date.toTimeString().slice(0, 5);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setTimelineEvents((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
      
      if (!isSimulationMode) {
        setIsSimulationMode(true);
        setOriginalOrder([...timelineEvents]);
      }
    }
  };

  const resetToOriginal = () => {
    if (originalOrder.length > 0) {
      setTimelineEvents(originalOrder);
    }
    setIsSimulationMode(false);
    setOriginalOrder([]);
  };

  const handleSimulate = (eventId: string) => {
    // Add delay simulation for specific event
    setTimelineEvents(prev => prev.map(event => 
      event.id === eventId
        ? {
            ...event,
            status: 'delayed' as const,
            delay: Math.floor(Math.random() * 10) + 5,
            estimatedTime: addMinutes(event.scheduledTime, Math.floor(Math.random() * 10) + 5)
          }
        : event
    ));
    
    if (!isSimulationMode) {
      setIsSimulationMode(true);
      setOriginalOrder([...timelineEvents]);
    }
  };

  return (
    <Card className="dashboard-card">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Interactive Timeline</h3>
            {isSimulationMode && (
              <Badge className="bg-warning/20 text-warning border-warning/30 pulse">
                Simulation Mode
              </Badge>
            )}
          </div>
          {isSimulationMode && (
            <Button
              size="sm"
              variant="outline"
              onClick={resetToOriginal}
              className="flex items-center gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </Button>
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          {isSimulationMode 
            ? "Drag trains to reorder or click 'Simulate' to add delays" 
            : "Drag trains to simulate schedule changes"}
        </div>

        <ScrollArea className="h-[400px]">
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={timelineEvents.map(event => event.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {timelineEvents.map((event) => (
                  <SortableTimelineItem
                    key={event.id}
                    event={event}
                    onSimulate={handleSimulate}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </ScrollArea>

        <div className="pt-4 border-t border-border">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">On Time</div>
              <div className="text-lg font-bold text-success">
                {isSimulationMode ? "89%" : "94%"}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Avg Delay</div>
              <div className="text-lg font-bold text-warning">
                {isSimulationMode ? "4.7m" : "2.3m"}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Impact</div>
              <div className="text-lg font-bold text-primary">
                {isSimulationMode ? "+12m" : "0m"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DragDropTimelinePanel;