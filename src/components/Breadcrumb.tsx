import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { BreadcrumbItem, constructBreadcrumbSchema } from '@/lib/seo';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

export function Breadcrumbs({ items, className = '', showHome = true }: BreadcrumbsProps) {
  const fullItems: BreadcrumbItem[] = showHome
    ? [{ name: 'Home', path: '/' }, ...items]
    : items;

  const jsonLd = constructBreadcrumbSchema(fullItems);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center text-xs font-medium text-muted-foreground overflow-x-auto py-2.5 ${className}`}
      >
        <ol className="flex items-center space-x-1.5 sm:space-x-2">
          {fullItems.map((item, idx) => {
            const isLast = idx === fullItems.length - 1;
            return (
              <li key={item.path} className="flex items-center">
                {idx > 0 && (
                  <ChevronRight
                    className="w-3.5 h-3.5 mx-1 text-muted-foreground/40 flex-shrink-0"
                    aria-hidden="true"
                  />
                )}
                {isLast ? (
                  <span
                    className="text-foreground font-semibold truncate max-w-[200px] sm:max-w-[320px]"
                    aria-current="page"
                  >
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.path}
                    className="flex items-center hover:text-primary transition-colors hover:underline"
                  >
                    {idx === 0 && showHome && (
                      <Home className="w-3.5 h-3.5 mr-1 flex-shrink-0" aria-hidden="true" />
                    )}
                    <span>{item.name}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
