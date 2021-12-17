function getExplorerUrl(value: string, prefix?: string): string {
    return `https://explorer.harmony.one/${prefix ? `${prefix}/` : ''}${value}`;
}

export default getExplorerUrl;
