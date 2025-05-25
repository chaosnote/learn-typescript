
let pre_index: number = 0;
let sub_index: number = 0;

/**
 * 流水號(範例)
 * 
 * ``` js
 * import kernel from 'kernel';
 * 
 * kernel.genSerial();
 * ```
 * 
 * @returns string
 */
export function genSerial() : string {
    let current_index = (new Date()).getTime();
    if (current_index == pre_index) {
        sub_index++;
    } else {
        pre_index = current_index;
        sub_index = 0;
    }

    return `${pre_index}.${sub_index}` ;
}