import { render, screen, fireEvent } from "@testing-library/react";
import jest from 'jest-mock';
import EditForm from "./EditForm";

describe("EditForm component", () => {

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
    expect(mockCallBack.mock.calls.length).toEqual(1);
    expect(mockCallBack.mock.calls[0][0]).toBe('cancel');
  });

  // it("should ", () => {});

});
