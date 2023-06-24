import { EventEmitter } from "node:events";
import modules from "./modules/index.js";

class Emitter extends EventEmitter {
  throw = (error) => {
    this.emit("error", error);
  };

  execute = async (module, command, lineArguments, application) => {
    await modules[module][command](lineArguments, application);
  };
}
export { Emitter };
