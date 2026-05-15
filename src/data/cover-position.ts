export interface FocalPoint {
  /** Horizontal position as a fraction of source width (0 left → 1 right). */
  x: number;
  /** Vertical position as a fraction of source height (0 top → 1 bottom). */
  y: number;
}

/**
 * Container aspect ratios (W / H) for the project detail hero
 * (`h-[70vh]` × 100vw). Used to precompute `object-position` per
 * breakpoint so the focal point stays as close to centered as
 * `object-cover` cropping allows.
 */
export const HERO_CONTAINER_ASPECT = {
  /** Typical phone portrait at 70vh — ~390 × 590. */
  mobile: 0.66,
  /** Typical laptop at 70vh — ~1280 × 560. */
  desktop: 2.3,
} as const;

/**
 * Project the focal coordinate onto the visible window of an `object-cover`
 * image, then return the CSS `object-position` that puts it there.
 *
 * For each axis the image overflows after `cover` scaling, we compute the
 * fraction of source that fits in the container, then anchor `focal` at
 * the container center — clamping when the focal sits too close to an
 * image edge to be centered.
 */
export function computeObjectPosition(
  focal: FocalPoint,
  imageAspect: number,
  containerAspect: number,
): string {
  const fX = imageAspect > containerAspect ? containerAspect / imageAspect : 1;
  const fY = imageAspect < containerAspect ? imageAspect / containerAspect : 1;

  const axis = (coord: number, fraction: number) =>
    fraction < 1
      ? Math.max(0, Math.min(1, (coord - 0.5 * fraction) / (1 - fraction)))
      : 0.5;

  const px = axis(focal.x, fX);
  const py = axis(focal.y, fY);

  return `${(px * 100).toFixed(1)}% ${(py * 100).toFixed(1)}%`;
}
