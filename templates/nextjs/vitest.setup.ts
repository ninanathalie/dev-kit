/**
 * Vitest Setup — Next.js
 *
 * Runs before each test file. Adds custom matchers from @testing-library/jest-dom
 * so you can write assertions like:
 *   expect(element).toBeInTheDocument()
 *   expect(element).toHaveTextContent("hello")
 *
 * See: https://github.com/testing-library/jest-dom
 */

import "@testing-library/jest-dom/vitest";
