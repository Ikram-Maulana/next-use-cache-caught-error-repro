// Same caught 'use cache' error, read inside a <Suspense> boundary.
import { Suspense } from "react";

async function getExtra(id: string) {
  "use cache";
  if (id.startsWith("bad")) {
    throw new Error(`upstream failed for ${id}`);
  }
  return `extra for ${id}`;
}

async function Extra({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let extra = "fallback";
  try {
    extra = await getExtra(id);
  } catch {
    // The failure is handled: the page renders with a fallback.
  }
  return <p id="result">{`${id}: ${extra}`}</p>;
}

export function generateStaticParams() {
  return [{ id: "ok" }];
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<p>loading</p>}>
      <Extra params={params} />
    </Suspense>
  );
}
