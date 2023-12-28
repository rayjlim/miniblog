import { render, screen, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { vi } from 'vitest';
import '@testing-library/jest-dom';

import MediaList from "../../components/MediaList";
const queryClient = new QueryClient();
const fetchMock = vi.fn(() => ({
  json: vi.fn(() => act(() => Promise.resolve({ uploadDirs: ['dir1'], dirContent: ['media1'] }))),
  ok: true,
}));

vi.stubGlobal('fetch', fetchMock);
console.log = () => { };

describe("MediaList component", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  })

  it.skip("should render MediaList component correctly", () => {

    render(
      <QueryClientProvider client={queryClient}>
        <MediaList onMediaSelect={() => { }} />
      </QueryClientProvider>)
    const element = screen.getByText(/Dirs/);
    expect(element).not.toBeNull();
    expect(element).toBeInTheDocument();
    const text = screen.getByText(/Media/);
    expect(text).toBeInTheDocument();
  });
});
