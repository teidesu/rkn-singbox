export async function fetchBlockedDomains(): Promise<string[]> {
    const res = await fetch('https://reestr.rublacklist.net/api/v3/domains/')
    if (!res.ok) {
        throw new Error(`Failed to fetch blocked domains: ${res.statusText}`)
    }
    return await res.json()
}

export async function fetchDpiBlockedDomains(): Promise<string[]> {
    const res = await fetch('https://reestr.rublacklist.net/api/v3/dpi/')
    if (!res.ok) {
        throw new Error(`Failed to fetch DPI blocked domains: ${res.statusText}`)
    }
    const data = await res.json()
    return data.flatMap((entry: any) => entry.domains)
}
