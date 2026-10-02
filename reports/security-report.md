# Security Report

## Rating: Average — 62/100

## Observed on the public host

| Control | Status |
|---|---|
| HTTPS | Present |
| HTTP/3 advertisement | Present (`alt-svc`) |
| CSP | Present only as `upgrade-insecure-requests` |
| HSTS | Not observed |
| X-Content-Type-Options | Not observed |
| X-Frame-Options / CSP frame-ancestors | Not observed |
| Referrer-Policy | Not observed |
| Permissions-Policy | Not observed |
| Explicit Cache-Control | Not observed |

The host returns Hostinger CDN headers and a dynamic HTML cache status. These settings must be changed in Hostinger/CDN configuration, not in the static site source.

## Recommended host configuration

```text
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'self'; upgrade-insecure-requests
```

Tune the CSP with all required Google, Microsoft Clarity, jsDelivr, unpkg, and font origins before enforcing it. Deploy first as `Content-Security-Policy-Report-Only`.

## Application observations

- Consent Mode defaults analytics and advertising storage to denied.
- Contact-form anti-spam controls require live endpoint testing; no server-side form handler exists in the static source.
- Third-party dependencies are remote and version ranges include `@latest` for Lucide. Pin versions and use Subresource Integrity where supported.
- No secret-bearing environment files were included in the generated output reviewed.
