import { EventEmitter } from "node:events";

class ErrorEventEmitter extends EventEmitter {
  throw = (error) => {
    this.emit("error", error.message);
  };
}

const emitter = new ErrorEventEmitter();

emitter.on("error", (message) => {
  console.error(message);
});

export { emitter };
