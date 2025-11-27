import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const postsDirectory = path.join(process.cwd(), 'posts');

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  author: string;
  category?: string;
  difficulty?: string;
  readTime: string;
  content: string;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  author: string;
  category?: string;
  difficulty?: string;
  readTime: string;
}

/**
 * Tüm blog postlarının meta bilgilerini al
 */
export function getAllPosts(): BlogPostMeta[] {
  // posts klasörü yoksa boş dizi döndür
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  
  const posts = fileNames
    .filter((fileName) => fileName.endsWith('.mdx') || fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.(mdx|md)$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      
      // Okuma süresini hesapla
      const stats = readingTime(content);
      
      return {
        slug,
        title: data.title || 'Untitled',
        date: data.date || new Date().toISOString(),
        description: data.description || '',
        tags: data.tags || [],
        author: data.author || 'Free AI Prompt Maker',
        category: data.category,
        difficulty: data.difficulty,
        readTime: data.readTime || stats.text,
      };
    })
    // Tarihe göre sırala (yeniden eskiye)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

/**
 * Tek bir blog postunu al
 */
export function getPostBySlug(slug: string): BlogPost | null {
  if (!fs.existsSync(postsDirectory)) {
    return null;
  }

  // Önce MDX, sonra MD uzantısını dene
  let fullPath = path.join(postsDirectory, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) {
    fullPath = path.join(postsDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
      return null;
    }
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const stats = readingTime(content);

  return {
    slug,
    title: data.title || 'Untitled',
    date: data.date || new Date().toISOString(),
    description: data.description || '',
    tags: data.tags || [],
    author: data.author || 'Free AI Prompt Maker',
    category: data.category,
    difficulty: data.difficulty,
    readTime: data.readTime || stats.text,
    content,
  };
}

/**
 * Tüm post slug'larını al (static generation için)
 */
export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  
  return fileNames
    .filter((fileName) => fileName.endsWith('.mdx') || fileName.endsWith('.md'))
    .map((fileName) => fileName.replace(/\.(mdx|md)$/, ''));
}

/**
 * Kategoriye göre postları al
 */
export function getPostsByCategory(category: string): BlogPostMeta[] {
  const allPosts = getAllPosts();
  return allPosts.filter((post) => post.category === category);
}

/**
 * Tag'e göre postları al
 */
export function getPostsByTag(tag: string): BlogPostMeta[] {
  const allPosts = getAllPosts();
  return allPosts.filter((post) => post.tags.includes(tag));
}

/**
 * İlgili postları al (aynı kategori veya tag)
 */
export function getRelatedPosts(currentSlug: string, limit: number = 3): BlogPostMeta[] {
  const currentPost = getPostBySlug(currentSlug);
  if (!currentPost) return [];

  const allPosts = getAllPosts().filter((post) => post.slug !== currentSlug);
  
  // Skor hesapla - aynı kategori veya tag varsa artır
  const scoredPosts = allPosts.map((post) => {
    let score = 0;
    
    if (currentPost.category && post.category === currentPost.category) {
      score += 2;
    }
    
    currentPost.tags.forEach((tag) => {
      if (post.tags.includes(tag)) {
        score += 1;
      }
    });
    
    return { ...post, score };
  });

  // Skora göre sırala ve limitli döndür
  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Tüm kategorileri al
 */
export function getAllCategories(): string[] {
  const allPosts = getAllPosts();
  const categories = new Set<string>();
  
  allPosts.forEach((post) => {
    if (post.category) {
      categories.add(post.category);
    }
  });
  
  return Array.from(categories);
}

/**
 * Tüm tag'leri al
 */
export function getAllTags(): string[] {
  const allPosts = getAllPosts();
  const tags = new Set<string>();
  
  allPosts.forEach((post) => {
    post.tags.forEach((tag) => tags.add(tag));
  });
  
  return Array.from(tags);
}

