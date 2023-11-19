import { render, screen } from "@testing-library/react";
import jest from 'jest-mock';
import MediaList from "./MediaList";

global.fetch = jest.fn(() => Promise.resolve({
  json: Promise.resolve(['dir1','dir2','dir3',])}
  ));

describe("MediaList component", () => {
  it("should render MediaList component correctly", () => {
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
