// Same 'use cache' function, but the page does not catch its error.
async function getExtra(id: string) {
  "use cache";
  if (id.startsWith("bad")) {
    throw new Error(`upstream failed for ${id}`);
  }
  return `extra for ${id}`;
}

export function generateStaticParams() {
  return [{ id: "ok" }];
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const extra = await getExtra(id);
  return <p id="result">{`${id}: ${extra}`}</p>;
}
