

export class EventUtil {

    private static _eventEmitter: any;

    static EventEmitterInstance() {
        if (EventUtil._eventEmitter === undefined) {
            var EventEmitter = require('events');
            EventUtil._eventEmitter = new EventEmitter();
        }
        return EventUtil._eventEmitter;
    }

    static Subscribe(eventName: string, action: Function) {
        this.EventEmitterInstance().on(eventName, action);
    }

    static UnSubscribe(eventName: string, action: Function) {
        this.EventEmitterInstance().off(eventName, action);
    }

    static Emit(eventName: string, [...args]) {
        this.EventEmitterInstance().emit(eventName, [...args]);
    }
}