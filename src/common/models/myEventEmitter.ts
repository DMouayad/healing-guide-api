import EventEmitter from "node:events";
import { USER_EVENTS } from "src/rest-api/user/user.events";
import type { IAppEvent } from "../types";

class MyEventEmitter extends EventEmitter {
	emitAppEvent(event: IAppEvent) {
		this.emit(event.name, event);
	}
}
export const myEventEmitter = new MyEventEmitter();

for (const event of Object.values(USER_EVENTS)) {
	myEventEmitter.on(event, (emitted: IAppEvent) => {
		emitted.handler();
	});
}
