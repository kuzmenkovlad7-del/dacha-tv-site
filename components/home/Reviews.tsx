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

export function Reviews({ reviews }: ReviewsProps) {
  if (reviews.length === 0) return null

  return (
    <section className="py-16 md:py-24 bg-honey-50" aria-labelledby="reviews-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="reviews-heading" className="font-serif text-3xl md:text-4xl font-bold text-bark mb-4">
            Відгуки покупців
          </h2>
          <p className="text-bark/60 text-lg">
            Реальні відгуки від наших покупців
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.slice(0, 6).map((review) => (
            <blockquote
              key={review._id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-honey-100 flex flex-col"
            >
              <StarRating rating={review.rating} />

              <p className="text-bark/80 mt-4 mb-6 leading-relaxed flex-1 italic">
                &ldquo;{review.quote}&rdquo;
              </p>

              <footer>
                <cite className="not-italic">
                  <span className="font-semibold text-bark">{review.reviewerName}</span>
                  {review.city && (
                    <span className="text-bark/50 text-sm ml-1">· {review.city}</span>
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
