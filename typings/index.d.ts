/// <reference path="globals/bluebird/index.d.ts" />
/// <reference path="globals/node/index.d.ts" />

declare module 'line-by-line' {
    import * as events from "events";
    import * as stream from "stream";
    class LineByLine extends events.EventEmitter {
        constructor(path: string,options?:{encoding:string,skipEmptyLines:boolean,start:number});
        pause(): void;
        resume(): void;
        close(): void;
    }
    export = LineByLine
}
