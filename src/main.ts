import * as fsp from 'node:fs/promises'
import * as path from 'node:path'
import * as cp from 'node:child_process'
import { fileURLToPath } from 'node:url'

import { fetchIpBans } from './dump-parser'
import { fetchAntizapretDomains, fetchAntizapretExcludeRegexes } from './antizapret'
import { fetchBlockedDomains, fetchDpiBlockedDomains } from './rublacklist'

const OUT_DIR = fileURLToPath(new URL('../out', import.meta.url))

await fsp.mkdir(OUT_DIR, { recursive: true })

const domains = new Set<string>()

console.log('fetching data')
const [
    antizapretDomains,
    antizapretExcludeRegexes,
    blockedDomains,
    dpiBlockedDomains,
    { ips, cidrs },
] = await Promise.all([
    fetchAntizapretDomains(),
    fetchAntizapretExcludeRegexes(),
    fetchBlockedDomains(),
    fetchDpiBlockedDomains(),
    fetchIpBans(),
])

console.log('processing data')

function maybeAddDomain(domain: string) {
    for (const regex of antizapretExcludeRegexes) {
        if (regex.test(domain)) {
            return
        }
    }

    if (domain.startsWith('www.')) {
        domain = domain.slice(4)
    }

    domains.add(domain)
}

antizapretDomains.forEach(maybeAddDomain)
blockedDomains.forEach(maybeAddDomain)
dpiBlockedDomains.forEach(maybeAddDomain)

// process domains: remove more specific domains
while (true) {
    const domainsToRemove = new Set<string>()

    for (const domain of domains) {
        const parts = domain.split('.')
        while (parts.length >= 2) {
            parts.shift()
            const parent = parts.join('.')
            if (domains.has(parent)) {
                domainsToRemove.add(domain)
                break
            }
        }
    }

    if (domainsToRemove.size === 0) {
        break
    }

    for (const domain of domainsToRemove) {
        domains.delete(domain)
    }
}

const domainsList = Array.from(domains).sort()

const json = {
    version: 1,
    rules: [
        { domain: domainsList },
        { domain_suffix: domainsList.map(domain => `.${domain}`) },
        {
            ip_cidr: [
                ...cidrs,
                ...ips,
            ],
        },
    ],
}

await fsp.writeFile(path.join(OUT_DIR, 'rkn-ruleset.json'), JSON.stringify(json, null, 2))

console.log('compiling')

cp.spawnSync('sing-box', [
    'rule-set',
    'compile',
    '--output',
    path.join(OUT_DIR, 'rkn-ruleset.srs'),
    path.join(OUT_DIR, 'rkn-ruleset.json'),
], { stdio: 'inherit' })
