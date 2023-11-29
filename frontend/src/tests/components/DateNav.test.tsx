import { render, screen, fireEvent } from "@testing-library/react";
import renderer from 'react-test-renderer';

import { vi } from 'vitest';
import jest from 'jest-mock';
import '@testing-library/jest-dom';

import DateNav from "../../components/DateNav";

const fetchMock = vi.fn(() => ({
  json: vi.fn(() => Promise.resolve({ uploadDirs: ['dir1'], dirContent: ['media1'] })),
  ok: true,
}));

vi.stubGlobal('fetch', fetchMock);
const RealDate = Date.now
let spy: any = null;

console.log = () => {};

describe("DateNav component", () => {
  beforeAll(() => {
    console.log('Normal:   ', new Date().getTime())

    const mockDate = new Date(Date.parse('2019-04-22'));
    spy = jest
      .spyOn(global, 'Date')
      .mockImplementation(() => mockDate);
    global.Date.now = jest.fn(() => new Date('2019-04-22T00:00:00Z').getTime())
    global.Date.UTC = jest.fn(() => new Date('2019-04-22T00:00:00Z').getTime())
    console.log('Mocked:   ', new Date().getTime())
  })

  afterAll(() => {
    spy?.mockRestore()

    console.log('Restored: ', new Date().getTime())
    global.Date.now = RealDate;
  })

  afterEach(() => {
    vi.restoreAllMocks();
  })

  it("should render DateNav component correctly", () => {
    const mockCallBack = jest.fn();
    render(<DateNav updateDate={mockCallBack} date={'2023-11-12'} />);
    const btn = screen.getByText(/Prev/);
    expect(btn).not.toBeNull();
    expect(btn).toBeInTheDocument();
    const btn2 = screen.getByText(/Next/);
    expect(btn2).toBeInTheDocument();
    const btn3 = screen.getByText(/Today/);
    expect(btn3).toBeInTheDocument();
  });

  it("should render DateNav component correctly", () => {
    const mockCallBack = jest.fn();
    const tree = renderer
    .create(<DateNav updateDate={mockCallBack} date={'2023-11-12'} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
  });

  it("should go to Today on btn click", () => {
    const mockCallBack = jest.fn();
    render(<DateNav updateDate={mockCallBack} date={'2023-11-08'} />);

    const input = screen.getByLabelText('date-input');

    expect(input).toBeInTheDocument();
    fireEvent.change(input, {target: {value: '2022-01-01'}});

    const btn = screen.getByText(/Today/);
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);

    expect(mockCallBack).toHaveBeenCalledTimes(2);
    expect(mockCallBack.mock.calls[0][0]).toBe('2022-01-01');
    expect(mockCallBack.mock.calls[1][0]).toBe('2019-04-22');
  });

  it("should go to Prev on btn click", () => {
    const mockCallBack = jest.fn();
    render(<DateNav updateDate={mockCallBack} date={'2023-11-10'} />);

    const btn = screen.getByText(/Prev/);
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);

    expect(mockCallBack).toHaveBeenCalledTimes(1);
    expect(mockCallBack.mock.calls[0][0]).toBe('2023-11-09');
  });

  it("should go to Next on btn click", () => {
    const mockCallBack = jest.fn();
    render(<DateNav updateDate={mockCallBack} date={'2023-11-10'} />);

    const btn = screen.getByText(/Next/);
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);

    expect(mockCallBack).toHaveBeenCalledTimes(1);
    expect(mockCallBack.mock.calls[0][0]).toBe('2023-11-11');
  });
  it("should go to new date on input select", () => {
    const mockCallBack = jest.fn();
    render(<DateNav updateDate={mockCallBack} date={'2023-11-10'} />);

    const input = screen.getByLabelText('date-input');

    expect(input).toBeInTheDocument();
    fireEvent.change(input, {target: {value: '2022-01-01'}});

    expect(mockCallBack).toHaveBeenCalledTimes(1);
    expect(mockCallBack.mock.calls[0][0]).toBe('2022-01-01');
  });
});
