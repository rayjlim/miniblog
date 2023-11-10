// @ts-nocheck
import { render, screen, fireEvent } from "@testing-library/react";

import jest from 'jest-mock';
import EditForm from "./EditForm";

global.fetch = jest.fn(() =>
  Promise.resolve({"id":"1","content":"99 9 fasdf","date":"2023-11-09","user_id":"1"})
);

window.alert = () => {};
console.log = () => {};


describe("EditForm component", () => {
  beforeEach(() => {
    HTMLCanvasElement.prototype.getContext = jest.fn();
    fetch.mockClear();
  });
  it("should render EditForm component correctly", () => {

    render(<EditForm entry={{id: '1', content: 'entry text', date: '2000-01-01'}} onSuccess={()=>{}}/>);
    const element = screen.getByText(/Cancel/);
    expect(element).not.toBeNull();
    expect(element).toBeInTheDocument();
  });

  it('Test click Cancel event', () => {

    const mockCallBack = jest.fn();

    render(<EditForm entry={{id: '1', content: 'entry text', date: '2000-01-01'}} onSuccess={mockCallBack}/>);
    const btn = screen.getByTestId('cancelBtn');
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn)

    expect(mockCallBack).toHaveBeenCalledTimes(1);
    expect(mockCallBack.mock.calls[0][0]).toBe('cancel');
  });

  it("should Save content on submit", () => {
    const mockSuccessCb = jest.fn();

    render(<EditForm entry={{id: '1', content: 'entry text', date: '2000-01-01'}} onSuccess={mockSuccessCb}/>);
    const btn = screen.getByTestId('saveBtn');
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn)
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][0]).toBe("http://localhost/projects/miniblog/backend/api/posts/1")
    expect(fetch.mock.calls[0][1].body).toBe("{\"content\":\"entry text\",\"date\":\"2000-01-01\"}")

    expect(mockSuccessCb).toHaveBeenCalledTimes(1);
    expect(mockSuccessCb.mock.calls[0][0]).toBe('Edit Done');

  });

});