# Security

ResonanceLab can be published as a public frontend and contract-source repository.

Do not commit:

- private keys
- wallet vaults
- `.env` files
- `.vercel/`
- local dashboard state
- wallet JSON exports

The contract treats audio-session claims, source pages, calibration notes, disputes and appeals as untrusted input. Prompt-injection defenses are included in the contract prompts.
