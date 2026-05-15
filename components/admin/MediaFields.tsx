// Shared media block for all product edit/create forms
interface MediaFieldsProps {
  imageUrl?: string | null
  imageAlt?: string | null
  youtubeUrl?: string | null
  youtubeFieldName?: string // default: 'youtube_url'
}

export function MediaFields({
  imageUrl,
  imageAlt,
  youtubeUrl,
  youtubeFieldName = 'youtube_url',
}: MediaFieldsProps) {
  return (
    <fieldset className="border-t border-gray-100 pt-5 space-y-4">
      <legend className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-0.5">Медіа</legend>

      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
          Головне зображення
        </label>
        <input
          name="image_url"
          type="text"
          defaultValue={imageUrl ?? ''}
          placeholder="/images/dacha-tv/... або https://..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
        />
        {imageUrl && (
          <div className="mt-2 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 h-24 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt={imageAlt ?? ''} className="max-h-full max-w-full object-contain" />
          </div>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
          Alt-текст зображення
        </label>
        <input
          name="image_alt"
          type="text"
          defaultValue={imageAlt ?? ''}
          placeholder="Опис зображення для пошукових систем"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
          YouTube відео
        </label>
        <input
          name={youtubeFieldName}
          type="text"
          defaultValue={youtubeUrl ?? ''}
          placeholder="https://youtube.com/watch?v=..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
        />
      </div>
    </fieldset>
  )
}
