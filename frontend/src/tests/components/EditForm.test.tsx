// @ts-nocheck
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from 'vitest'
import jest from 'jest-mock';
import EditForm from "../../components/EditForm";

const fetchMock = vi.fn(() => ({
  json: vi.fn(() => Promise.resolve({ "id": "1", "content": "99 9 fasdf", "date": "2023-11-09", "user_id": "1" })),
  ok: true,
}));

vi.stubGlobal('fetch', fetchMock);

window.alert = () => { };
window.confirm = () => true;
console.log = () => {};

describe("EditForm component", () => {
  beforeEach(() => {
    HTMLCanvasElement.prototype.getContext = jest.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  })

  it("should render EditForm component correctly", () => {

    render(<EditForm entry={{ id: 1, content: 'entry text', date: '2000-01-01' }} onSuccess={() => { }} />);
    const element = screen.getByText(/Cancel/);
    expect(element).not.toBeNull();
    expect(element).toBeInTheDocument();
  });

  it('should Cancel and responde', () => {

    const mockCallBack = jest.fn();

    render(<EditForm entry={{ id: 1, content: 'entry text', date: '2000-01-01', locations: '' }} onSuccess={mockCallBack} />);
    const btn = screen.getByTestId('cancelBtn');
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);

    expect(mockCallBack).toHaveBeenCalledTimes(1);
    expect(mockCallBack.mock.calls[0][0]).toBe('');
  });

  it("should Save content on submit", async () => {
    const mockSuccessCb = jest.fn();

    render(<EditForm entry={{ id: 1, content: 'entry text', date: '2000-01-01', locations: '' }} onSuccess={mockSuccessCb} />);
    const btn = screen.getByTestId('saveBtn');
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn)
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][0]).toContain("/api/posts/1");
    expect(fetch.mock.calls[0][1].method).toBe("PUT");
    expect(fetch.mock.calls[0][1].body).toMatchSnapshot();

    await waitFor(() => expect(mockSuccessCb).toHaveBeenCalledTimes(1));
    expect(mockSuccessCb.mock.calls[0][0]).toBe('Edit Done');

  });

  it("should Delete call and respond", async () => {
    const mockSuccessCb = jest.fn();

    render(<EditForm entry={{ id: 2, content: 'entry text', date: '2000-01-01' }} onSuccess={mockSuccessCb} />);
    const btn = screen.getByTestId('deleteBtn');
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn)
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][0]).toContain("/api/posts/2")
    expect(fetch.mock.calls[0][1].method).toBe("DELETE")

    await waitFor(() => expect(mockSuccessCb).toHaveBeenCalledTimes(1));
    expect(mockSuccessCb.mock.calls[0][0]).toBe('Delete Done');

  });

  // test edit content
  // test edit date
  // test shortcut keys
  // test keychange font-awesome insert

});
