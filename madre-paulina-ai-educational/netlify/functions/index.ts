export const runtime = 'edge';

export async function GET() {
  return new Response('Welcome to Madre Paulina AI Educational Platform v4.0', {
    headers: { 'Content-Type': 'text/plain' }
  });
}

export async function POST() {
  return new Response('This is not a valid endpoint', {
    status: 404,
    headers: { 'Content-Type': 'text/plain' }
  });
}