import { derived, readable } from "svelte/store";
import { addMinutes, format, parse } from 'date-fns';

const toUTC = (t: Date): Date => addMinutes(t, t.getTimezoneOffset());

export const time = readable(new Date(), function start(set) {
    const interval = setInterval(() => {
        set(new Date());
    }, 1000);

    return function stop() {
        clearInterval(interval);
    };
});

export const utctime = derived(
    time,
    $time => toUTC($time)
);


const parseDateFmt = "yyyy-MM-dd'T'HH:mm:ssxxx";
const parseDateUTCFmt = "yyyy-MM-dd'T'HH:mm:ssX";

class ServerTime {
    public now: string
    public nowUTC: string
    public error: string

    constructor(){
        this.now = format(new Date(), "ppp");
        this.nowUTC = format(new Date(), "pp");
        this.error = null;
    }

    setup(nowStr: string, nowUTCStr: string) {
        this.now = "";
        this.nowUTC = "";
        const nowParsed = parse(nowStr, parseDateFmt, new Date());
        this.now = format(nowParsed, "ppp");

        const nowUTCParsed = parse(nowUTCStr, parseDateUTCFmt, new Date());
        this.nowUTC = format(toUTC(nowUTCParsed), "pp");
        this.error = null;
    }
}

const API_HOST = process.env.API_HOST;

export const serverTime = readable(new ServerTime(), function start(set) {
    let handle = null;
    let isRunning = true;

    async function doRequest() {
        const sv = new ServerTime();
        try {
            const response = await fetch(`${API_HOST}/api/v1/time`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            });
            const data = await response.json();


            const { now, nowUTC } = data;

            sv.setup(now, nowUTC);

            console.group("Server Payload")
            console.info("Server data:", data);
            console.info("Client data:", sv);
            console.groupEnd()
        } catch (e) {
            sv.error = `${e}.`;
        } finally {
            set(sv);
            if (isRunning) {
                handle = setTimeout(doRequest, 800);
            }
        }
    }


    doRequest();


    return function stop() {
        isRunning = false;
        clearTimeout(handle);
    }
})
