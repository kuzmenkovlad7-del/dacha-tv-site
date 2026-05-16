'use client'
import { useState, useCallback } from 'react'

const INPUT =
  'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent'
const LABEL = 'block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5'
const ICON_BTN =
  'shrink-0 h-8 w-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors text-base leading-none'
const ADD_BTN =
  'inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors'

interface MediaFieldsProps {
  imageUrl?: string | null
  imageAlt?: string | null
  galleryImages?: string[] | null
  youtubeUrl?: string | null
  youtubeFieldName?: string
  youtubeUrls?: string[] | null
  productName?: string
}

export function MediaFields({
  imageUrl,
  imageAlt,
  galleryImages,
  youtubeUrl,
  youtubeFieldName = 'youtube_video_url',
  youtubeUrls,
  productName = '',
}: MediaFieldsProps) {
  const [imageUrlState, setImageUrlState] = useState(imageUrl ?? '')
  const [imageAltState, setImageAltState] = useState(imageAlt ?? '')
  const [previewSrc, setPreviewSrc] = useState(imageUrl ?? '')
  const [gallery, setGallery] = useState<string[]>(() =>
    (galleryImages ?? []).filter(Boolean),
  )
  const [primaryYt, setPrimaryYt] = useState(youtubeUrl ?? '')
  const [extraYts, setExtraYts] = useState<string[]>(() =>
    (youtubeUrls ?? []).filter(Boolean),
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      setPreviewSrc(URL.createObjectURL(file))
    },
    [],
  )

  const handleUrlChange = (val: string) => {
    setImageUrlState(val)
    if (!val.startsWith('blob:')) setPreviewSrc(val)
  }

  const autoAlt = () => {
    if (productName) setImageAltState(`${productName} — Dacha TV`)
  }

  return (
    <fieldset className="border-t border-gray-100 pt-5 space-y-5">
      <legend className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        Медіа
      </legend>

      {/* Primary image */}
      <div>
        <label className={LABEL}>Головне зображення</label>
        {previewSrc && (
          <div className="mb-2 h-28 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewSrc}
              alt={imageAltState}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        )}
        <input
          type="file"
          name="image_file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/avif"
          onChange={handleFileChange}
          className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
        />
        <p className="text-xs text-gray-400 mt-1.5 mb-1">або вставте URL:</p>
        <input
          name="image_url"
          type="text"
          value={imageUrlState}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="/images/dacha-tv/... або https://..."
          className={INPUT}
        />
      </div>

      {/* Alt text */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            Alt-текст
          </span>
          {productName && (
            <button
              type="button"
              onClick={autoAlt}
              className="text-xs text-gray-400 hover:text-gray-700 underline underline-offset-2"
            >
              Авто
            </button>
          )}
        </div>
        <input
          name="image_alt"
          type="text"
          value={imageAltState}
          onChange={(e) => setImageAltState(e.target.value)}
          placeholder="Опис зображення для SEO"
          className={INPUT}
        />
      </div>

      {/* Gallery */}
      <div>
        <label className={LABEL}>Галерея (до 4 фото)</label>
        <div className="space-y-2">
          {gallery.map((url, i) => (
            <div key={i} className="flex gap-2">
              <input
                name="gallery_images"
                type="text"
                value={url}
                onChange={(e) =>
                  setGallery((g) => g.map((v, j) => (j === i ? e.target.value : v)))
                }
                placeholder="https://..."
                className={INPUT}
              />
              <button
                type="button"
                onClick={() => setGallery((g) => g.filter((_, j) => j !== i))}
                className={ICON_BTN}
              >
                ×
              </button>
            </div>
          ))}
          {gallery.length < 4 && (
            <button
              type="button"
              onClick={() => setGallery((g) => [...g, ''])}
              className={ADD_BTN}
            >
              + Додати фото до галереї
            </button>
          )}
        </div>
      </div>

      {/* Primary YouTube */}
      <div>
        <label className={LABEL}>YouTube (головне відео)</label>
        <input
          name={youtubeFieldName}
          type="text"
          value={primaryYt}
          onChange={(e) => setPrimaryYt(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className={INPUT}
        />
      </div>

      {/* Additional YouTube */}
      <div>
        <label className={LABEL}>Додаткові відео YouTube (до 3)</label>
        <div className="space-y-2">
          {extraYts.map((url, i) => (
            <div key={i} className="flex gap-2">
              <input
                name="youtube_video_urls"
                type="text"
                value={url}
                onChange={(e) =>
                  setExtraYts((y) => y.map((v, j) => (j === i ? e.target.value : v)))
                }
                placeholder="https://www.youtube.com/watch?v=..."
                className={INPUT}
              />
              <button
                type="button"
                onClick={() => setExtraYts((y) => y.filter((_, j) => j !== i))}
                className={ICON_BTN}
              >
                ×
              </button>
            </div>
          ))}
          {extraYts.length < 3 && (
            <button
              type="button"
              onClick={() => setExtraYts((y) => [...y, ''])}
              className={ADD_BTN}
            >
              + Додати відео
            </button>
          )}
        </div>
      </div>
    </fieldset>
  )
}
