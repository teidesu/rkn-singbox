import { createInterface } from 'node:readline'
import { createGunzip } from 'node:zlib'

import { decodeStream } from 'iconv-lite'

import { webStreamToNode } from './utils'

export interface RknDumpEntry {
    ips: string[]
    domains?: string[]
    urls?: string[]
}

export async function* rknDumpCsv() {
    const res = await fetch('https://raw.githubusercontent.com/zapret-info/z-i/master/dump.csv.gz')
    if (!res.ok) {
        throw new Error(`Failed to download RKN dump: ${res.statusText}`)
    }

    const stream = webStreamToNode(res.body!)
        .pipe(createGunzip())
        .pipe(decodeStream('win1251'))
    const reader = createInterface({
        input: stream,
        crlfDelay: Number.POSITIVE_INFINITY,
    })

    let firstLine = true
    for await (const line of reader) {
        if (!line) continue
        if (firstLine) {
            // Updated: 2024-05-10 11:10:02 +0000
            firstLine = false
            continue
        }

        const [ips, domains, urls] = line.split(';')
        const entry: RknDumpEntry = { ips: ips.split('|') }

        if (domains) {
            entry.domains = domains.split('|')
        }

        if (urls) {
            entry.urls = urls.split('|')
        }

        yield entry
    }
}

export async function fetchIpBans() {
    const ips = new Set<string>()
    const cidrs = new Set<string>()
    for await (const entry of rknDumpCsv()) {
        if (entry.domains || entry.urls) continue

        for (const ip of entry.ips) {
            if (ip.includes('/')) {
                cidrs.add(ip)
            } else {
                ips.add(ip)
            }
        }
    }

    return {
        ips: Array.from(ips),
        cidrs: Array.from(cidrs),
    }
}
