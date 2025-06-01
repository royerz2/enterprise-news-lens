
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ArticleLinkProps {
  articleId: string;
  children: React.ReactNode;
  className?: string;
}

export function ArticleLink({ articleId, children, className }: ArticleLinkProps) {
  return (
    <Link 
      to={`/article/${articleId}`}
      className={cn(
        'text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-colors',
        className
      )}
    >
      {children}
    </Link>
  );
}
