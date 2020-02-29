declare global {
    namespace NodeJS {
        interface Global {
            env: any;
            config: any;
        }
    }
    interface Window {
        env: any;
        config: any;
    }
}
export declare const setPath: (filePath?: string) => void;
