import Image from 'next/image'
import type { Review } from '@/types'

interface ReviewsProps {
  reviews: Review[]
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`Оцінка: ${rating} з 5 зірок`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-honey-500' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

function ReviewerInitial({ name }: { name: string }) {
  const initial = name.trim().charAt(0).toUpperCase()
  return (
    <div className="w-10 h-10 rounded-full bg-honey-100 border-2 border-honey-200 flex items-center justify-center flex-shrink-0">
      <span className="font-serif font-bold text-honey-700 text-sm">{initial}</span>
    </div>
  )
}

export function Reviews({ reviews }: ReviewsProps) {
  if (reviews.length === 0) return null

  return (
    <section className="py-20 md:py-28 bg-cream" aria-labelledby="reviews-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-honey-700 uppercase tracking-widest mb-4 block">
            Відгуки
          </span>
          <h2 id="reviews-heading" className="font-serif text-3xl md:text-4xl font-bold text-bark mb-4">
            Що кажуть наші покупці
          </h2>
          <p className="text-gray-500 text-base">
            Реальні відгуки від людей, які вже замовляли у нас
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.slice(0, 6).map((review) => (
            <blockquote
              key={review.id}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              <StarRating rating={review.rating} />

              <p className="text-gray-700 mt-5 mb-6 leading-relaxed flex-1 text-sm">
                &ldquo;{review.quote}&rdquo;
              </p>

              {review.photo_url && (
                <div className="mb-4 relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-gray-100">
                  <Image
                    src={review.photo_url}
                    alt={review.reviewer_name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 350px"
                  />
                </div>
              )}

              <footer className="flex items-center gap-3">
                <ReviewerInitial name={review.reviewer_name} />
                <cite className="not-italic">
                  <span className="font-semibold text-bark text-sm block">{review.reviewer_name}</span>
                  {review.city && (
                    <span className="text-gray-400 text-xs">{review.city}</span>
                  )}
                </cite>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
