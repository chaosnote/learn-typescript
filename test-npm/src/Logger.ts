import { custom_decorators } from "./Decorators";

const success_style = "background:#007bff;color:#fff;font-size:14px;" ; // padding:1px;
const second_style = "background:#28a745;color:#fff;font-size:14px;" ;
const warn_style = "background:#fd7e14;color:#fff;font-size:14px;" ;
const danger_style = "background:#dc3545;color:#fff;font-size:14px;" ;

/**
 * 除錯工具
 */
class simple_logger {
    constructor(private class_name: string) { }

    debug(func_name: string, ...args: any[]): void {
        console.log(`%c===== [D]${this.class_name}.${func_name} =====\n%o`, success_style, args);
    }
    warn(func_name: string, ...args: any[]): void {
        console.log(`%c===== [W]${this.class_name}.${func_name} =====\n%o`, warn_style, args);
    }
    error(func_name: string, ...args: any[]): void {
        console.log(`%c===== [E]${this.class_name}.${func_name} =====\n%o`, danger_style, args);
    }
}
/**
 * 除錯工具(不具輸出功能)
 */
class zero_logger {
    constructor(private class_name: string) { }
    debug(msg: string, ...args: any[]): void { }
    warn(msg: string, ...args: any[]): void { }
    error(msg: string, ...args: any[]): void { }
}
/**
 * 除錯工具
 *
 * 範例:
 * 
 * ``` js
 * 
 * import { Logger } from 'kernel';
 * import kernel from 'kernel';
 * 
 * \@kernel.trace(bool)
 * 
 * private _logger : ILogger ;
 * 
 * ```
 */
export interface ILogger {
    /**
     * 輸出調試級別的訊息。
     * @function
     * @name Debug
     * @param {string} func_name - 要輸出的調試訊息。
     * @param {...any} args - 可選的額外參數，將替換訊息中的佔位符。
     * @returns {void}
     */
    debug(func_name: string, ...args: any[]): void;

    /**
     * 輸出警告級別的訊息。
     * @function
     * @name Warn
     * @param {string} func_name - 要輸出的警告訊息。
     * @param {...any} args - 可選的額外參數，將替換訊息中的佔位符。
     * @returns {void}
     */
    warn(func_name: string, ...args: any[]): void;

    /**
     * 輸出錯誤級別的訊息。
     * @function
     * @name Error
     * @param {string} func_name - 要輸出的錯誤訊息。
     * @param {...any} args - 可選的額外參數，將替換訊息中的佔位符。
     * @returns {void}
     */
    error(func_name: string, ...args: any[]): void;
}
/**
 * 產生 console 輸出功能
 *
 * @param {boolean} debug - 是否啟用輸出模式。
 * @param {string} class_name - 要追蹤的類名稱。
 * @returns {ILogger} 返回一個 ILog 實例。
 */
export function genLogger(debug: boolean, class_name: string): ILogger {
    if (debug) {
        return new simple_logger(class_name);
    }
    return new zero_logger(class_name);
}
/**
 * Decorator console 輸出功能
 * 
 * @param {boolean} debug - 是否啟用輸出模式。
 */
export function logger(debug: boolean): custom_decorators {
    // target : Object.prototype
    // key : 欄位名稱
    return (target: any, key: string) => {
        let class_name = target.constructor.name;
        let ref: ILogger = genLogger(debug, class_name) ;

        const getter = () => ref;

        Object.defineProperty(target, key, {
            get: getter,
            enumerable: true,
            configurable: true
        });

        return ref;
    };
}
