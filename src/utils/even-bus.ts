export type EventMap<
  EventTypes extends string = string,
  Payload extends unknown = unknown,
> = {
  [Type in EventTypes]: Payload;
};

/** intentionally private, use createEventBus to create instances */
function defineEventBus<EventKind extends EventMap>() {
  const subscribers: Record<
    keyof EventKind,
    Set<(payload: any) => void>
  > = {} as Record<keyof EventKind, Set<(payload: any) => void>>;

  const subscribe = <Key extends keyof EventKind>(
    eventType: Key,
    handler: (payload: EventKind[Key]) => void
  ) => {
    if (!(eventType in subscribers)) {
      subscribers[eventType] = new Set();
    }
    subscribers[eventType].add(handler);
    return () => {
      subscribers[eventType].delete(handler);
    };
  };

  const broadcast = <Key extends keyof EventKind>(
    eventType: keyof EventKind,
    payload: EventKind[Key]
  ) => {
    if (!(eventType in subscribers) || !subscribers[eventType]) {
      return;
    }
    subscribers[eventType].forEach((cb) => cb(payload));
  };

  return {
    subscribe,
    broadcast,
  };
}

export function createEventBus<EventKind extends EventMap>() {
  const eventBus = defineEventBus<EventKind>();

  const broadcast = <Type extends keyof EventKind>(
    type: Type,
    payload: EventKind[Type]
  ) => eventBus.broadcast(type, payload);

  const subscribe = <Type extends keyof EventKind>(
    type: Type,
    handler: (payload: EventKind[Type]) => void
  ) => eventBus.subscribe(type, handler as any);

  const useBroadcastEvent =
    <Type extends keyof EventKind>(type: Type) =>
    (payload: EventKind[Type]) =>
      broadcast(type, payload);

  return {
    broadcast,
    subscribe,
    useBroadcastEvent,
  };
}
