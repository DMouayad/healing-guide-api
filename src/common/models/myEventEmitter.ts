import EventEmitter from "node:events";
import { type IUserEvent, USER_EVENTS } from "@/api/user/user.events";

class MyEventEmitter extends EventEmitter {}
export const myEventEmitter = new MyEventEmitter();

for (const event of USER_EVENTS) {
	myEventEmitter.on(event, (emitted: IUserEvent) => {
		emitted.handler();
	});
}
