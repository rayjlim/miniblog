import { render, screen, act } from "@testing-library/react";
import { vi } from 'vitest'
import '@testing-library/jest-dom';

import MediaList from "./MediaList";

const fetchMock = vi.fn(() => ({
  json: vi.fn(()=> Promise.resolve({uploadDirs:['dir1'], dirContent: ['media1']})),
  ok: true,
}));

vi.stubGlobal('fetch', fetchMock);

describe("MediaList component", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  })

  it("should render MediaList component correctly", () => {
    render(<MediaList onMediaSelect={() => { }} />);
    const element = screen.getByText(/Dirs/);
    expect(element).not.toBeNull();
    expect(element).toBeInTheDocument();
    const text = screen.getByText(/Media/);
    expect(text).toBeInTheDocument();
  });
});
