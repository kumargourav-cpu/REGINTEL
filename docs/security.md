# Security

- PII minimization: only file metadata plus bounded extraction snippets are stored.
- No secrets in frontend; backend holds env secrets.
- Upload size limits enforced server-side via MAX_UPLOAD_MB.
- Backend endpoints protected via Supabase JWT verification (Bearer token).
