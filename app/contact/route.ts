export function GET() {
  return new Response(null, {
    status: 307,
    headers: {
      Location: `mailto:caleb.roche2.0@gmail.com`,
    },
  });
}
