import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api, InsightArticle } from '@/lib/api';
import { ArrowRightIcon, BookOpenIcon } from '@heroicons/react/24/outline';

export const revalidate = 60;

export default async function InsightsPage() {
  let articles: InsightArticle[] = [];

  try {
    articles = await api.insights.getAll();
  } catch {
    // Fallback
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-white py-14 border-b border-neutral-200">
        <div className="container-custom">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">
              Thought Leadership & Market Advisory
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900">
              SwiftStruct Insights
            </h1>
            <p className="text-neutral-600 text-sm">
              Articles and industry analysis covering real estate investment, construction trends, project management practices, and market dynamics.
            </p>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-14 flex-1">
        <div className="container-custom">
          {articles.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-neutral-200 max-w-lg mx-auto my-12 space-y-3">
              <BookOpenIcon className="w-12 h-12 text-neutral-300 mx-auto" />
              <h3 className="text-xl font-bold text-neutral-900">No articles published yet</h3>
              <p className="text-neutral-500 text-sm">Check back soon for new real estate and construction insights.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {article.featuredImage && (
                      <div className="aspect-[16/9] bg-neutral-50 overflow-hidden">
                        <img
                          src={article.featuredImage}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between text-xs font-semibold text-neutral-900">
                        <span className="uppercase tracking-wider">{article.category}</span>
                        <span className="text-neutral-500 font-normal">
                          {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : ''}
                        </span>
                      </div>

                      <h2 className="font-bold text-neutral-900 text-xl leading-snug group-hover:text-neutral-600 transition">
                        {article.title}
                      </h2>

                      <p className="text-neutral-600 text-sm leading-relaxed line-clamp-3">
                        {article.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-xs text-neutral-500 font-medium">By {article.author}</span>
                    <Link
                      href={`/insights/${article.slug}`}
                      className="text-xs font-bold text-neutral-900 group-hover:text-neutral-600 transition inline-flex items-center gap-1"
                    >
                      Read Article <ArrowRightIcon className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
