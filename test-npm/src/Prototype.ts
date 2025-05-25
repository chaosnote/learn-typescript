export {}

declare global {
    interface Uint8Array {
        fromCharCode: () => string;
    }
    interface String {
        base64decode: () => string;
        toUint8Array: () => Uint8Array;
        padStart(targetLength: number, padString: string): string;
    }
}

Uint8Array.prototype.fromCharCode = function (): string {
    return String.fromCharCode.apply(null, this.slice(0, this.length));
}

String.prototype.base64decode = function (): string {
    return decodeURIComponent(atob(this).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
}

String.prototype.toUint8Array = function (): Uint8Array {
    var pos = new Uint8Array([this.length]);
    var content = Uint8Array.from(Array.from<String>(this).map((letter) => letter.charCodeAt(0)));

    var dist = new Uint8Array(pos.length + content.length);
    dist.set(pos, 0);
    dist.set(content, pos.length);
    return dist;
}

String.prototype.padStart = function padStart(max_len: number, pad_string: string) {
    max_len = max_len >> 0; // 取整
    pad_string = String((typeof pad_string !== 'undefined' ? pad_string : ' '));
    if (this.length >= max_len) {
        return String(this);
    } else {
        max_len = max_len - this.length;
        if (max_len > pad_string.length) {
            pad_string += pad_string.repeat(max_len / pad_string.length); // 補字串
        }
        return pad_string.slice(0, max_len) + String(this);
    }
};

