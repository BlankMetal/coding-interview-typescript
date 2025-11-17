# Quick Start Guide for Candidates

Welcome! This is a simple coding interview framework. You only need to edit **one file**.

## Setup (Before Interview)

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the development server:
   ```bash
   pnpm dev
   ```

3. Open http://localhost:3000 in your browser

You should see:
   - A green banner at the top: **"✓ Connectivity successful"**
   - Below that: "You are ready to interview! 🎉"

If you see a red error banner instead about Vercel connectivity, please debug any connectivity issues with `.vercel.app` domains. If you're certain it's not your machine, reach out to your recruiter.

## During Interview

### You only need to edit: `lib/solution.ts`

This file has two things you need to fill in:

#### Step 1: Add Backend URL
At the top of the file, paste the backend API URL you receive:

```typescript
export const BACKEND_ENDPOINT = "https://your-backend-url.vercel.app";
```

#### Step 2: Implement Your Solution
Below that, implement the `calc()` function:

```typescript
export function calc(
  p1?: number | null,
  p2?: number | null,
  p3?: number | null,
  p4?: number | null,
  p5?: number | null,
  p6?: number | null
): number {
  // Your code here
  return 0;
}
```

### Testing Your Solution

1. Save your changes to `lib/solution.ts`
2. Go to http://localhost:3000
3. Click the "Run Tests" button
4. See your results:
   - ✓ Green = Test passed
   - ✗ Red = Test failed

You can run the tests as many times as you want.

## Important Notes

- **Only edit `lib/solution.ts`** - don't change any other files
- Handle `null` parameters appropriately
- The function signature must stay the same (don't change parameter names)
- Read the problem description carefully in the file comments

Good luck! 🚀
