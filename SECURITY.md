# Security Policy

## Reporting a vulnerability

Please report security issues privately. Don't open a public issue.

- Use GitHub's **Report a vulnerability** button under the repository's **Security** tab, or
- email **support@resumespace.site** with the subject "Security".

Include what you found, how to reproduce it, and the impact you think it has. You'll get an acknowledgement
within a few days. Please give us reasonable time to fix the issue before disclosing it publicly.

## Scope

In scope: the site at https://www.resumespace.site and the code in this repository, for example authentication,
access to other users' saved resumes, injection, or leaking of secrets.

Out of scope: denial-of-service or load testing, automated scanner output without a demonstrated impact,
social engineering, and issues in third-party services (Supabase, Vercel, DeepSeek, Google) that should be
reported to those vendors.

## Please don't

- Access, modify or delete data that isn't yours.
- Run automated attacks against the live site's AI or PDF endpoints. They are rate limited, and abusing them
  costs real money.

## Secrets

No secrets are stored in this repository. Configuration lives in environment variables (see the README). If you
find a credential in the code or its history, report it as above.
