import Link from "next/link";
import { notFound } from "next/navigation";
import { getMergedDoc, schemaById, DOC_IDS, type DocId } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { MediaProvider } from "@/components/admin/media-context";

export default async function EditContentPage({
  params,
}: {
  params: Promise<{ doc: string }>;
}) {
  const { doc } = await params;
  const schema = schemaById.get(doc);
  if (!schema || !DOC_IDS.includes(doc as DocId)) notFound();

  const [data, assets] = await Promise.all([
    getMergedDoc(doc as DocId),
    prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" }, take: 300 }),
  ]);

  return (
    <>
      <div className="a-head">
        <div>
          <h1 className="a-title">{schema.title}</h1>
          <p className="a-sub">{schema.blurb}</p>
        </div>
        {schema.route ? (
          <Link
            href={schema.route}
            className="a-btn"
            target="_blank"
            rel="noreferrer"
          >
            View page ↗
          </Link>
        ) : null}
      </div>

      <MediaProvider
        initialAssets={assets.map((asset) => ({
          id: asset.id,
          url: asset.url,
          filename: asset.filename,
          alt: asset.alt,
          width: asset.width,
          height: asset.height,
        }))}
      >
        <ContentEditor schema={schema} initial={data} />
      </MediaProvider>
    </>
  );
}
