# Quickstart: Validate CLT-176

```bash
npm test
npm run build:standalone
npm run dev   # http://localhost:8081
```

1. Open `http://localhost:8081/?data=hausa-lettersounds` (and again with `&assessmentUIMode=new-ui`). Use the dev-mode bucket controls to reach buckets 6–7.
2. When the audio says "l", the option shows "L". Picking it is scored correct.
3. When the audio says "a", the option shows "A". Picking it is scored correct. "ai" and "au" stay lowercase.
4. Open `?data=hausa-sightwords`, `?data=hausa-spellings` and `?data=english-lettersounds`: nothing has changed.
5. On a device that already had the assessment cached, reopen it: the new labels appear (content v0.4).
