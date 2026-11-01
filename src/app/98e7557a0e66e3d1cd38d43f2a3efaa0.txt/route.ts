export async function GET() {
  return new Response('98e7557a0e66e3d1cd38d43f2a3efaa0\n', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
