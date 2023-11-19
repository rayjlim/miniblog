import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import {jest} from '@jest/globals'

import MediaList from "./MediaList";

global.fetch = require('jest-fetch-mock');

beforeEach(() => {
  // fetch.resetMocks();
});

describe("MediaList component", () => {
  it.skip("should render MediaList component correctly", () => {
    (global.fetch as  jest.Mock).mockResolvedValue(JSON.stringify(['dir1','dir2','dir3',]) as never);
    // fetch.mockResponseOnce(JSON.stringify(['dir1','dir2','dir3',]));

    render(<MediaList onMediaSelect={() => { }} />);
    const element = screen.getByText(/Dirs/);
    expect(element).not.toBeNull();
    // expect(element).toBeInTheDocument();
    // const text = screen.getByText(/Media/);
    // expect(text).toBeInTheDocument();
  });
  // it("test only usage", () => {
  //   expect(1).toEqual(1);
  // });
  // it("test2 only usage", () => {
  //   expect(1).toEqual(1);
  // });
});
