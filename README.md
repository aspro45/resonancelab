# ResonanceLab

ResonanceLab is a GenLayer Studionet project for public audio and signal provenance. It records sessions, source proofs, calibration notes, analysis results, disputes, appeals and final pressed records.

The interface is a synth/radio console with a live oscilloscope, patch matrix, knobs and signal reels. It is intentionally far away from the earlier court, market, map, atelier or dashboard layouts.

## Repository Contents

- `index.html` - static console shell
- `styles.css` - dark signal-rack visual system
- `app.js` - interactive waveform and session preview
- `contracts/resonancelab.py` - GenLayer intelligent contract source
- `deployment.json` - Studionet deployment metadata
- `config.js` - frontend contract configuration

## Contract Surface

Primary source: `contracts/resonancelab.py`

Studionet contract:

- Address: `0x7e55CfCB3078FE8E91a70D346DCC353d8962514d`
- Explorer: <https://explorer-studio.genlayer.com/contracts/0x7e55CfCB3078FE8E91a70D346DCC353d8962514d>
- Deploy tx: <https://explorer-studio.genlayer.com/tx/0x69d4beb5aac021f32a3e2adf03b6929a551771abfb51a20ea8cd014cb5a9e38d>

Core write methods:

- `set_lab_standard`
- `register_session`
- `add_signal_proof`
- `add_calibration`
- `open_analysis`
- `analyze_session_with_genlayer`
- `open_dispute_channel`
- `file_dispute`
- `resolve_dispute_with_genlayer`
- `file_appeal`
- `resolve_appeal_with_genlayer`
- `press_record`
- `archive_session`
- `recalculate_reputation`

Core read methods:

- `get_session`
- `get_recent_sessions`
- `get_signal_proofs`
- `get_calibrations`
- `get_analyses`
- `get_disputes`
- `get_appeals`
- `get_audit_log`
- `get_frontend_bootstrap`

Smoke coverage:

- `register_session` plus three signal proofs
- two calibration records
- `analyze_session_with_genlayer`
- dispute + GenLayer dispute resolution
- appeal + GenLayer appeal resolution
- `press_record`
- `recalculate_reputation`

Read test status: `18/18` passed.

## Local Preview

```powershell
npx serve . -l 8080
```

Open:

```text
http://localhost:8080/
```

## Public Release

- Repository: <https://github.com/aspro45/resonancelab>
- Live app: <https://resonancelab-navy.vercel.app>
- Runtime: static HTML/CSS/JavaScript
- Deployment metadata: `deployment.json`

## Security

Private keys, vault files, `.env`, `.vercel/`, local dashboard state and wallet exports must stay out of GitHub/Vercel. The contract treats all source pages and session notes as untrusted content and includes prompt-injection instructions in every GenLayer reasoning path.
