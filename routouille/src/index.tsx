import { Hono } from 'hono';
import { renderer } from './renderer';

const patterns = {
  route: [/^.*\/src\/(routes|api)\/|\.(js|ts|jsx|tsx)$/g, ''],
  splat: [/\[\.\.\.{3}\w+\]/g, '*'],
  param: [/\[([^\]]+)\]/g, ':$1'],
  slash: [/^index$|\./g, '/'],
  optional: [/^-(:?[\w-]+|\*)/, '$1?'],
} as const;

function createRoutePath(filePath: string): string {
  const normalized = filePath.replace(/^\.\//, '');
  const trimmed = normalized.replace(...patterns.route);
  const parts = trimmed
    .replace(...patterns.splat)
    .replace(...patterns.param)
    .split('/')
    .filter((seg) => seg && seg !== '.');
  const segments = parts.map((seg) =>
    seg.replace(...patterns.slash).replace(...patterns.optional)
  );
  const path = segments.length ? `/${segments.join('/')}` : '/';
  // remove trailing slash if not the root path
  return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
}

const httpMethods = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'OPTIONS',
] as const;
type HttpMethod = (typeof httpMethods)[number];

function registerFileRoutes(
  app: Hono,
  modules: Record<string, any>,
  basePath: string = '/'
) {
  Object.entries(modules).forEach(([filePath, module]) => {
    let routePath = createRoutePath(filePath); // e.g. "/api/users/:id"
    // if it already starts with your basePath, drop that prefix
    if (basePath !== '/' && routePath.startsWith(basePath)) {
      routePath = routePath.slice(basePath.length) || '/';
    }
    const finalPath = basePath === '/' ? routePath : `${basePath}${routePath}`;

    httpMethods.forEach((method) => {
      const handler = module[method];
      if (typeof handler === 'function') {
        (app as any)[method.toLowerCase()](finalPath, handler);
      }
    });

    if (typeof module.default === 'function' && !module.GET) {
      app.get(finalPath, module.default);
    }
  });
}

const app = new Hono();

app.use(renderer);

const pageModules = import.meta.glob('./api/**/*.{js,ts,jsx,tsx}', {
  eager: true,
});
registerFileRoutes(app, pageModules, '/api');

console.log(app.routes);

export default app;
