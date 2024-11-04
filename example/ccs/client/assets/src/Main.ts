import { _decorator, Component, Node } from 'cc';
//-----------------------------------------------
// import { Logger, WebSocketConn } from 'kernel';
// import kernel from 'kernel';

import { ILogger, ISignal, IWebSocketConn } from 'kernel';
import kernel from 'kernel';
//-----------------------------------------------
const { ccclass, property } = _decorator;
//-----------------------------------------------
const debug = true;
//-----------------------------------------------
@ccclass('Main')
export class Main extends Component {

    @kernel.logger(debug)
    private _logger: ILogger;

    @kernel.wsconn(debug)
    private _ws: IWebSocketConn;

    private test_serial(): void {
        const msg = "test.serial";

        this._logger.debug(msg, kernel.genSerial());
        this._logger.debug(msg, kernel.genSerial());
        this._logger.debug(msg, kernel.genSerial());
        this._logger.debug(msg, kernel.genSerial());
    }

    private test_signal(): void {
        const msg = "test.signal";

        let signal: ISignal = kernel.genSignal();
        //// signal.on((...args: any[]) => console.log(...args)) ;
        signal.on((...args: any[]) => this._logger.debug(msg, ...args));

        signal.emit("test.abc", "test.def");
    }

    private test_web_socket(): void {
        const msg = "test_web_socket";

        const game_id = "1019";
        const addr = `http://localhost:8080/ws`;

        this._ws.open.on(() => {
            this._logger.debug(msg, "open");
            this._ws.send("test[0]".toUint8Array());
            this._ws.send("test[1]");
        });
        this._ws.close.on((reson: string) => this._logger.debug(msg, reson));
        this._ws.error.on(() => this._logger.error(msg, "error"));

        this._ws.message_binary.on((pack: Uint8Array) => {
            // pack 拆解
        });
        this._ws.message_text.on((pack: string) => this._logger.debug(msg, pack));

        this._ws.dial(addr, 'arraybuffer');
        // this.ws_conn.dial(addr, 'blob');
    }

    start() {
        const msg = "start";

        console.log(kernel);

        this.test_serial();
        this.test_signal();
        this.test_web_socket();
    }
}
