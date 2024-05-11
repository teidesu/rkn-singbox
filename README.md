# rkn-singbox

[![ci badge](https://github.com/teidesu/rkn-singbox/actions/workflows/update.yaml/badge.svg)](https://github.com/teidesu/rkn-singbox/actions/workflows/update.yaml)
![last updated](https://img.shields.io/github/last-commit/teidesu/rkn-singbox/ruleset?label=updated)

sing-box ruleset for russia (thanks to rkn).

updated daily based on the [rublacklist api](https://reestr.rublacklist.net/),
[antizapret lists](https://bitbucket.org/anticensority/antizapret-pac-generator-light/src/master/config/)
and [zapret-info/z-i](https://github.com/zapret-info/z-i) lists.

## usage

> [!IMPORTANT]
> this ruleset currently supports pre-1.9.0 ruleset format (see [here](https://sing-box.sagernet.org/migration/#domain_suffix-behavior-update)),
> but will probably be updated to the new format when 1.9.0 is released for some time, as the new format allows for smaller rulesets.

put the following in your config json:
```json
{
    "route": {
        "rules": [
            {
                "tag": "rkn",
                "format": "binary",
                "type": "remote",
                "url": "https://github.com/teidesu/rkn-singbox/raw/ruleset/rkn-ruleset.srs"
            }
        ]
    }
}
```

for a more sophisticated server-side setup with fakeip (similar to [antizapret-vpn-container](https://bitbucket.org/anticensority/antizapret-vpn-container)),
see [here](https://github.com/teidesu/nixos/blob/master/hosts/koi/services/sing-box.nix)

## running

```bash
bun install --frozen-lockfile
bun run src/main.ts
```
