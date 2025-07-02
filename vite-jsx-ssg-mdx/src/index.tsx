import { Hono } from 'hono';
import { renderer } from './renderer';
import { allPosts } from 'content-collections';

const app = new Hono();

app.use(renderer);

app.get('/', (c) => {
  return c.render(
    <ul>
      {allPosts.map((post) => (
        <li key={post._meta.path}>
          <a href={`/posts/${post._meta.path}`}>
            <h3>{post.title}</h3>
            <p>{post.summary}</p>
          </a>
        </li>
      ))}
    </ul>
  );
});

app.get('/posts/:slug', (c) => {
  const post = allPosts.find((p) => p._meta.path === c.req.param('slug'));
  if (!post) {
    return c.notFound();
  }
  return c.render(
    <article>
      <h1>{post.title}</h1>
      <p>{post.summary}</p>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
});

export default app;
