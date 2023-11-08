import { render, screen } from "@testing-library/react";
import MediaList from "./MediaList";

// const MediaList = ({ content}: { content: string}) => {
//   return <>{content}</>;
// };

describe("MediaList component", () => {
  it("should render MediaList component correctly", () => {
    render(<MediaList onMediaSelect={()=>{}}/>);
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
