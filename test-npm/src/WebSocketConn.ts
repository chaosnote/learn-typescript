import { custom_decorators } from "./Decorators";
import { ISignal, genSignal } from "./Signal";
import { ILogger, genLogger } from "./Logger";

//-----------------------------------------------

interface open_signal extends ISignal {
    emit(): void;
    on(callback: () => void): string;
}
interface message_binary_signal extends ISignal {
    emit(pack: Uint8Array): void;
    on(callback: (pack: Uint8Array) => void): string;
}
interface message_blob_signal extends ISignal {
    emit(pack: string): void;
    on(callback: (pack: string) => void): string;
}
interface close_signal extends ISignal {
    emit(reason: string): void;
    on(callback: (reason: string) => void): string;
}
interface error_signal extends open_signal {
}

/**
 * 範例:
 * 
 * ``` js
 * import { WebsocketConn } from 'kernel';
 * import kernel from 'kernel';
 * 
 * \@kernel.wsconn(!BUILD)
 * 
 * ```
 */
export interface IWebSocketConn {
    /**
     * 連線開啟
     */
    open: open_signal;
    /**
     * 收到封包(arraybuffer)格式
     */
    message_binary: message_binary_signal;
    /**
     * 收到封包(blob)格式
     */
    message_text: message_blob_signal;
    /**
    * 連線關閉
    */
    close: close_signal;
    /**
     * 錯誤事件
     */
    error: error_signal;
    /**
     * @example
     * dial('ws://example.com', 'arraybuffer');
     * 
     * @param addr - WebSocket 伺服器的 URL 地址。
     * @param binary_type - 指定接收二進位數據的類型，可為 "blob" 或 "arraybuffer"。
     */
    dial(addr: string, binary_type: "blob" | "arraybuffer"): void;
    /**
     * 發送封包
     * 
     * @param {Uint8Array} pack - 遊戲封包
     */
    send(pack: string | Uint8Array): void;
    /**
     * 連線關閉
     */
    disconnect(): void;
}

class websocket_conn {
    constructor(debug: boolean) {
        this._logger = genLogger(debug, "websocket_conn");
    }
    private _websocket: WebSocket;
    private _logger: ILogger;

    private _todo: any[] = [];
    private _active: boolean = false;

    open: open_signal = genSignal();
    message_binary: message_binary_signal = genSignal();
    message_text: message_blob_signal = genSignal();
    close: close_signal = genSignal();
    error: error_signal = genSignal();
    /**
     * 延遲機制
     * 
     * @param ms 延遲微毫秒
     */
    private delay(ms: number): Promise<void> {
        return new Promise<void>((resolve) => setTimeout(resolve, ms));
    }
    /**
     * 發送封包
     * 
     * @param pack 封包
     */
    private flush(pack: string | Uint8Array): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this._websocket.readyState === WebSocket.OPEN) {
                this._websocket.send(pack);
                resolve();
            } else {
                reject(new Error(`websocket state ${this._websocket.readyState}`));
            }
        });
    }
    /**
     * 運行
     */
    private async excute(): Promise<void> {
        while (this._todo.length > 0) {
            const pack = this._todo.shift()!;
            await this.flush(pack);
            await this.delay(8.33); // 緩衝 8.33ms
        }
        this._active = false;
    }

    dial(addr: string, binary_type: "blob" | "arraybuffer"): void {
        if (this._websocket != undefined && this._websocket.readyState == WebSocket.OPEN) {
            this._logger.error("dial", "call disconnect(), before reconnecting")
            return
        }

        this._websocket = new WebSocket(addr);
        this._websocket.binaryType = binary_type;

        this._websocket.onopen = (event: Event) => this.open.emit();
        this._websocket.onmessage = (event: MessageEvent) => {
            if (event.data instanceof ArrayBuffer) {
                this.message_binary.emit(new Uint8Array(event.data));
            } else {
                this.message_text.emit(event.data);
            }
        }
        this._websocket.onclose = (event: CloseEvent) => this.close.emit(event.reason);
        this._websocket.onerror = (event: Event) => this.error.emit();
    }

    send(pack: string | Uint8Array): void {
        this._todo.push(pack);
        if (!this._active) {
            this._active = true;
            this.excute();
        }
    }

    disconnect(): void {
        if (this._websocket == undefined) return;

        const msg = "";
        this._websocket.close(1000, msg);
        this._websocket = undefined;
    }
}
/**
 * 產生 websocket 連線
 *
 * @param {boolean} debug - 是否啟用輸出模式。
 * @returns {IWebSocketConn} 返回一個 WebSocketConn 實例。
 */
export function genWebSocketConn(debug: boolean): IWebSocketConn {
    return new websocket_conn(debug);
}
/**
 * Decorator websocket 連線功能
 */
export function wsconn(debug: boolean): custom_decorators {
    // target : Object.prototype
    // key : 欄位名稱
    return (target: any, key: string): IWebSocketConn => {
        var ref = genWebSocketConn(debug);

        const getter = () => ref;

        Object.defineProperty(target, key, {
            get: getter,
            enumerable: true,
            configurable: true
        });

        return ref;
    };
}