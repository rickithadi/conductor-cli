import { EventEmitter } from 'events';

export interface EventBusEvent {
  type: string;
  data?: any;
  timestamp?: Date;
}

export class EventBus extends EventEmitter {
  private static instance: EventBus;

  constructor() {
    super();
  }

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  publish(event: EventBusEvent): void {
    this.emit(event.type, {
      ...event,
      timestamp: event.timestamp || new Date()
    });
  }

  subscribe(eventType: string, handler: (event: EventBusEvent) => void): void {
    this.on(eventType, handler);
  }

  unsubscribe(eventType: string, handler: (event: EventBusEvent) => void): void {
    this.off(eventType, handler);
  }
}

export const eventBus = EventBus.getInstance();