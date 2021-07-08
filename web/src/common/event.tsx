

export class EventUtil {

    private static eventEmitter: any;

    static EventEmitterInstance() {
        if (EventUtil.eventEmitter === undefined) {
            var EventEmitter = require('events');
            EventUtil.eventEmitter = new EventEmitter();
        }
        return EventUtil.eventEmitter;
    }
}