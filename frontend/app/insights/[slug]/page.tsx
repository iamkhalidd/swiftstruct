'use client';

import { useState, useEffect, use } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api, InsightArticle } from '@/lib/api';
import { ArrowLeft, BookOpen, User, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function InsightDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [article, setArticle] = useState<InsightArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadArticle() {
      try {
        const data = await api.insights.getBySlug(slug);
        setArticle(data);
      } catch {
        setError('Article not found.');
      } finally {
        setLoading(false);
      }
    }
    loadArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center space-y-3">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent" />
            <p className="text-slate-500 text-sm font-medium">Loading article...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20 container-custom">
          <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center max-w-md mx-auto space-y-4 shadow-sm">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h2 className="text-2xl font-bold text-slate-900">Article Not Found</h2>
            <p className="text-slate-600 text-sm">{error || 'The requested article could not be located.'}</p>
            <Link
              href="/insights"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-500 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Insights
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-14 border-b border-slate-800">
        <div className="container-custom max-w-4xl space-y-4">
          <Link href="/insights" className="text-xs text-blue-400 font-semibold hover:underline inline-flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Insights
          </Link>

          <span className="block text-xs font-bold uppercase tracking-widest text-blue-400">
            {article.category}
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            {article.title}
          </h1>

          <div className="flex items-center gap-6 text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-400" /> {article.author}
            </span>
            {article.publishedAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-400" /> {new Date(article.publishedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-14 flex-1">
        <div className="container-custom max-w-4xl space-y-8">
          {article.featuredImage && (
            <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-slate-100 border border-slate-200 shadow-sm">
              <img
                src={article.featuredImage}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <p className="text-lg font-semibold text-slate-800 leading-relaxed border-b border-slate-100 pb-6">
              {article.excerpt}
            </p>

            <div className="text-slate-700 text-base leading-relaxed space-y-4 whitespace-pre-line">
              {article.content}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
