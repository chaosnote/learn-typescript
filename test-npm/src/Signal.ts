
export type Callback = (...args: any[]) => void;

export interface ISignal {
    /**
     * 發送事件。
     * 
     * @param {...any[]} args - 傳遞給事件的參數。
     */
    emit(...args: any[]): void
    /**
     * 註冊一個回調函數。
     * 
     * @param {Callback} callback - 要註冊的回調函數。
     * @returns {string} 返回一個表示註冊 id 的字串。
     */
    on(callback: Callback): string
    /**
     * 刪除指定 ID 的項目。
     * 
     * @param {string} id - 要刪除的項目的 ID。
     */
    rm(id: string): void
    /**
     * 清除所有已註冊的 ID
     */
    clear(): void
}

let pre_signal_id: number = 0;
let sub_signal_id: number = 0;

function genSignalID() : string {
    let current_index = (new Date()).getTime();
    if (current_index == pre_signal_id) {
        sub_signal_id++;
    } else {
        pre_signal_id = current_index;
        sub_signal_id = 0;
    }

    return `${pre_signal_id}.${sub_signal_id}` ;
}

class custom_signal {
    constructor() {
        this.clear();
    }

    private _store: Record<string, Callback>;

    emit(...args: any[]): void {
        for (var key in this._store) {
            this._store[key].call(null, ...args);
        }
    }

    on(callback: Callback): string {
        let id: string = "custom.signal." + genSignalID();
        this._store[id] = callback;
        return id;
    }

    rm(id: string): void {
        delete this._store[id];
    }

    clear(): void {
        this._store = {};
    }
}
/**
 * 範例:
 * 
 * ``` js
 * 
 * import kernel from 'kernel';
 * 
 * let signal = kernel.genSignal() ;
 * signal.on((...args: any[]) => console.log(...args)) ;
 * 
 * signal.emit("test.abc") ;
 * 
 * ```
 * 
 * @returns ISignal
 */
export function genSignal(): ISignal {
    return new custom_signal();
}