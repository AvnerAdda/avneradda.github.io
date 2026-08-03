"use client";

import { useState } from 'react';
import articlesData from '../public/articles.json';

export default function Articles() {
  const [displayCount, setDisplayCount] = useState(4);
  const articles = articlesData;

  const handleShowMore = () => {
    setDisplayCount((prev) => prev + 4);
  };

  return (
    <div>
      <p className="section-eyebrow">Writing</p>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="section-title">Articles and notes</h2>
          <p className="section-lede">
            Thoughts on AI, data science, agent workflows, and building useful
            products with modern technology.
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {articles.slice(0, displayCount).map((article) => (
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            key={article.title}
            className="group block"
          >
            <article className="surface-card h-full">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <h3 className="text-xl font-semibold leading-7 text-white transition group-hover:text-emerald-100">
                  {article.title}
                </h3>
                <span className="shrink-0 text-sm text-stone-400">
                  {new Date(article.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                  })}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span key={tag} className="chip">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between gap-4 text-sm">
                <span className="text-stone-400">{article.readTime}</span>
                <span className="font-semibold text-emerald-200 transition group-hover:text-emerald-100">
                  Read article
                </span>
              </div>
            </article>
          </a>
        ))}
      </div>

      {displayCount < articles.length && (
        <div className="mt-8 flex justify-center">
          <button type="button" onClick={handleShowMore} className="secondary-action">
            Show more articles
          </button>
        </div>
      )}
    </div>
  );
}
