// Minimal edge function - TEST_MODE is enabled in Login.tsx
// This file exists only to prevent build errors

export default async () => {
  return new Response(
    JSON.stringify({ testMode: true }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}