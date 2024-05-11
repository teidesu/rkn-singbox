export async function fetchAntizapretDomains() {
    const res = await fetch('https://bitbucket.org/anticensority/antizapret-pac-generator-light/raw/master/config/include-hosts-dist.txt')
    if (!res.ok) {
        throw new Error(`Failed to fetch antizapret domains: ${res.statusText}`)
    }
    const text = await res.text()

    return text.split('\n').map(line => line.trim()).filter(line_1 => line_1 !== '')
}

export async function fetchAntizapretExcludeRegexes() {
    const res = await fetch('https://bitbucket.org/anticensority/antizapret-pac-generator-light/raw/master/config/exclude-regexp-dist.awk')
    if (!res.ok) {
        throw new Error(`Failed to fetch antizapret exclude regexes: ${res.statusText}`)
    }

    const text = await res.text()
    const regexes: RegExp[] = []
    for (const line of text.split('\n')) {
        if (line.trim() === '' || line.startsWith('#')) {
            continue
        }

        const m = line.match(/^\(?\/(.*)\/\)? \{next\}$/)
        if (m === null) {
            continue
        }

        if (m[1] === '\\*') continue

        regexes.push(new RegExp(m[1]))
    }

    return regexes
}
