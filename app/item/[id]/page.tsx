async function getExtra(id: string) {
  "use cache";
  if (id.startsWith("bad")) {
    throw new Error(`upstream failed for ${id}`);
  }
  return `extra for ${id}`;
}

export function generateStaticParams() {
  return [{ id: process.env.SAMPLE_ID ?? "ok" }];
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let extra = "fallback";
  try {
    extra = await getExtra(id);
  } catch {
    // The failure is handled: the page renders with a fallback.
  }
  return <p id="result">{`${id}: ${extra}`}</p>;
}
