# Mobile App Development Patterns

This file captures proven patterns discovered while building GemmaCards mobile app. Use these as reference for future similar projects.

## Qwen Model Strategy

**Use `qwen2.5-coder:14b` through Ollama stdin mode** — deliver full-task instructions in one prompt rather than interactive shell splits that produce partial output.

```bash
# Good: Full task in stdin mode
echo 'Implement pack opening with tear gesture and 10-card reveal' | ollama run qwen2.5-coder:14b > output.txt

# Bad: Interactive multi-prompt splits
ollama run qwen2.5-coder:14b  # Waits for prompt
# Type partial task → gets partial terminal output without confirmation
```

**Verify every generated file before applying** — review outputs, correct issues, then commit rather than letting Qwen self-patch unchecked.

## Test-First + Frozen Releases

When building features on mobile projects:

1. **Write failing test** — prove behavior is missing  
2. **Implement with Qwen** — stdin mode, verify output
3. **Run 16/16 test suite** — minimum including accessibility checks  
4. **Tag as frozen release** — `git tag "prototype-vX.Y.Z"` for stable demo access  
5. **Publish incrementally** — Web first, then Android APK, finally iOS (if Apple account available)

## Platform Realities

| Platform | Toolchain Requirement | Alternative |
|----------|-----------|-------------|
| **iOS** | Xcode + macOS required for local build | EAS cloud build for signing; PWA "Add to Home Screen" without paid account |
| **Android** | Java/Android Studio for local APK | EAS cloud build (first use needs toolchain, subsequent via cache) |
| **Expo Hosting** | Web static export | Netlify/Vercel deployment of built files |

## Hard Constraints to Remember

- Never claim iOS builds succeeded on Windows — requires macOS
- Keep Expo hosting frozen by default — preserves stable demo URL
- Android first, iOS second — APK distribution doesn't require Apple Developer account  
- Freeze before publication — local development continues on branches independently
