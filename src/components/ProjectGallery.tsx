"use client";

import { useState } from "react";
import Image from "next/image";
import { RowsPhotoAlbum, type Photo } from "react-photo-album";
import "react-photo-album/rows.css";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import type { ImageMeta } from "@/data/project-media";

interface PhotoWithBlur extends Photo {
  blurDataURL: string;
}

export default function ProjectGallery({
  images,
  title,
}: {
  images: ImageMeta[];
  title: string;
}) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  if (!images || images.length === 0) return null;

  const photos: PhotoWithBlur[] = images.map((img) => ({
    src: img.src,
    width: img.width,
    height: img.height,
    blurDataURL: img.blurDataURL,
  }));

  return (
    <>
      {/* Mobile: simple single-column stack at native aspect */}
      <div className="md:hidden flex flex-col gap-3">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => setLightboxIndex(i)}
            className="block w-full text-left cursor-zoom-in"
            aria-label={`Open image ${i + 1}`}
          >
            <div
              className="relative w-full"
              style={{ aspectRatio: `${img.width} / ${img.height}` }}
            >
              <Image
                src={img.src}
                alt={`${title} — still ${i + 1}`}
                fill
                placeholder="blur"
                blurDataURL={img.blurDataURL}
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </button>
        ))}
      </div>

      {/* Desktop: justified rows mosaic, native aspect, no cropping */}
      <div className="hidden md:block">
        <RowsPhotoAlbum
          photos={photos}
          spacing={8}
          targetRowHeight={(containerWidth) => {
            if (containerWidth < 1024) return 280;
            if (containerWidth < 1440) return 340;
            return 400;
          }}
          rowConstraints={{ minPhotos: 1, maxPhotos: 4 }}
          onClick={({ index }) => setLightboxIndex(index)}
          render={{
            image: (_, { photo, width, height, index }) => (
              <Image
                src={photo.src}
                alt={`${title} — still ${index + 1}`}
                width={width}
                height={height}
                placeholder="blur"
                blurDataURL={(photo as PhotoWithBlur).blurDataURL}
                sizes="(min-width: 1440px) 50vw, (min-width: 1024px) 50vw, 33vw"
                className="cursor-zoom-in"
                priority={index === 0}
              />
            ),
          }}
        />
      </div>

      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex >= 0 ? lightboxIndex : 0}
        close={() => setLightboxIndex(-1)}
        slides={photos.map((p) => ({
          src: p.src,
          width: p.width,
          height: p.height,
        }))}
        styles={{
          container: { backgroundColor: "rgba(10, 10, 10, 0.96)" },
          slide: { padding: 0 },
        }}
        animation={{ fade: 300, swipe: 300 }}
        controller={{ closeOnBackdropClick: true }}
      />
    </>
  );
}
