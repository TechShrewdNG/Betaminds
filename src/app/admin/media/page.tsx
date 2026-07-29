import { prisma } from "@/lib/prisma";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { MediaProvider } from "@/components/admin/media-context";

export default async function MediaPage() {
  const assets = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <div className="a-head">
        <div>
          <h1 className="a-title">Media library</h1>
          <p className="a-sub">
            Upload the real photography here, then point a page&rsquo;s image
            field at it. Keep the crop ratios from the design handoff: hero 16/9,
            about 16/10, portraits 3/4, avatars 1/1, academy grid portrait, summit
            galleries square.
          </p>
        </div>
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
        <MediaLibrary
          assets={assets.map((asset) => ({
            id: asset.id,
            url: asset.url,
            filename: asset.filename,
            alt: asset.alt,
            width: asset.width,
            height: asset.height,
            size: asset.size,
            createdAt: asset.createdAt.toISOString(),
          }))}
        />
      </MediaProvider>
    </>
  );
}
