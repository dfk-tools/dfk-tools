declare module '*.module.less' {
    const className: Record<string, string>;
    export default className;
}

declare module '*.jpg' {
    const path: string;
    export default path;
}

declare module '*.jpeg' {
    const path: string;
    export default path;
}

declare module '*.png' {
    const path: string;
    export default path;
}

declare module '*.svg' {
    const path: string;
    export default path;
}

namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'production' | 'development';
        HARMONY_RPC_URL: string;
        HARMONY_CHAIN_ID: 'mainnet' | 'testnet';
    }
}
