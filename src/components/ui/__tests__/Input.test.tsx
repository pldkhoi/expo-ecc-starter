import { fireEvent, renderWithProviders, screen } from '@/test-utils/render';
import { Input } from '@/components/ui/Input';

describe('Input', () => {
  it('renders with a label and exposes it via accessibility', () => {
    renderWithProviders(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).toBeOnTheScreen();
  });

  it('renders an error message below the input', () => {
    renderWithProviders(<Input label="Email" error="Required" />);
    expect(screen.getByText('Required')).toBeOnTheScreen();
  });

  it('renders the hint when there is no error', () => {
    renderWithProviders(<Input label="Email" hint="We will not share it." />);
    expect(screen.getByText('We will not share it.')).toBeOnTheScreen();
  });

  it('calls onChangeText when the user types', () => {
    const onChangeText = jest.fn();
    renderWithProviders(<Input label="Name" onChangeText={onChangeText} />);
    fireEvent.changeText(screen.getByLabelText('Name'), 'Alice');
    expect(onChangeText).toHaveBeenCalledWith('Alice');
  });
});
