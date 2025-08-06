
"use client";

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Link href={item.href} className="hover:text-primary transition-colors">
            {item.label}
          </Link>
          {index < items.length - 1 && <ChevronRight className="h-4 w-4" />}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
