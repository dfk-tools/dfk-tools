async function requestAccounts(provider: unknown): Promise<unknown[]> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const accounts = await provider.request({ method: 'eth_requestAccounts' });
    
    return accounts;
}

export default requestAccounts;
