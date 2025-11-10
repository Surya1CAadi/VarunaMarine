# Reflection on AI-assisted Development

## What I learned using AI agents
Using AI assistants (Copilot and a conversational agent) considerably sped up routine tasks: generating boilerplate code (Express routes, Prisma adapters), drafting unit tests, and producing example `curl` commands. The AI helped me explore design alternatives quickly — particularly around separating domain logic (core) from adapters and sketching test cases for tricky edge cases.

## Efficiency gains vs manual coding
- **Time saved:** Frequent small patterns (CRUD routes, API client functions, test skeletons) were scaffolded in seconds instead of minutes.
- **Quality tradeoff:** The AI often produced correct initial drafts but required vetting — there were occasional incorrect assumptions (for example shell quoting differences on Windows or unavailable package versions) that needed manual correction.

## Things to improve next time
1. **Tighter prompt engineering:** Provide more explicit constraints (e.g., “do not include ES module syntax; use CommonJS for PostCSS config”) to reduce iteration.
2. **Integration tests earlier:** Add Supertest integration tests early to catch API wiring issues between controllers and Prisma.
3. **CI from day one:** Add GitHub Actions to run `npm test` and `prisma migrate` on each PR to ensure generated code remains valid in CI.
4. **Agent usage logs:** Record exact prompts and outputs to a private audit log while developing, and keep `AGENT_WORKFLOW.md` updated automatically.

## Final thought
AI agents are valuable accelerants when used carefully: treat their output as a draft — not final — and prioritize tests, small changes, and incremental commits. This project demonstrates how AI can help implement and test domain logic quickly while the developer maintains full control over correctness and architecture.