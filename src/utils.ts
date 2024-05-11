import * as fs from 'node:fs'
import { Readable } from 'node:stream'

export function webStreamToNode(stream: ReadableStream<Uint8Array>): Readable {
    const reader = stream.getReader()
    let ended = false

    const readable = new Readable({
        async read() {
            try {
                const { done, value } = await reader.read()

                if (done) {
                    this.push(null)
                } else {
                    this.push(Buffer.from(value.buffer, value.byteOffset, value.byteLength))
                }
            } catch (err) {
                this.destroy(err as Error)
            }
        },
        destroy(error, cb) {
            if (!ended) {
                void reader
                    .cancel(error)
                    .catch(() => {})
                    .then(() => {
                        cb(error)
                    })

                return
            }

            cb(error)
        },
    })

    reader.closed
        .then(() => {
            ended = true
        })
        .catch((err) => {
            readable.destroy(err as Error)
        })

    return readable
}
