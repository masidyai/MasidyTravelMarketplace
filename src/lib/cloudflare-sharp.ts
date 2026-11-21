export default function cloudflareSharpUnavailable(): never {
  throw new Error('Sharp image processing is unavailable in the minimal Cloudflare staging build.')
}
