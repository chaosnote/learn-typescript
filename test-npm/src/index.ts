import "./Prototype";

import * as _logger from "./Logger"
import * as _serial from "./Serial"
import * as _signal from "./Signal"
import * as _wsconn from "./WebSocketConn"

// export * from "./Decorators"
export * from "./Logger"
export * from "./Serial"
export * from "./Signal"
export * from "./WebSocketConn"

export default {
    ..._logger,
    ..._serial,
    ..._signal,
    ..._wsconn
};