import { EventEmitter } from "node:events";

class ErrorEventEmitter extends EventEmitter {
  console = (error) => {
    this.emit("error", error.message);
  };
}

const errorEvent = new ErrorEventEmitter();

errorEvent.on("error", (message) => {
  console.error(message);
});

export { errorEvent };
