import type { Context } from 'hono';

/**
 * Handles GET requests for /api/users/:id
 *
 * This function is an API endpoint that retrieves a user by their ID.
 * It demonstrates how to access URL parameters and return a JSON response.
 *
 * @param c The Hono context object.
 * @returns A JSON response with the user's data or an error message.
 */
export async function GET(c: Context) {
  // Access the 'id' parameter from the URL, e.g., /api/users/123
  const id = c.req.param('id');

  // You can add validation logic here
  if (!/^\d+$/.test(id)) {
    c.status(400);
    return c.json({
      success: false,
      error: 'Invalid user ID format. Must be a number.',
    });
  }

  // Return the data as a JSON response
  return c.json({
    success: true,
    user: {
      id: id,
      name: `User ${id}`,
      email: `user${id}@example.com`,
    },
  });
}
