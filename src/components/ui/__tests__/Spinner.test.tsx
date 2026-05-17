import { ActivityIndicator } from 'react-native';

import { Spinner } from '@/components/ui/Spinner';
import { renderWithProviders } from '@/test-utils/render';

describe('Spinner', () => {
  it('renders an ActivityIndicator', () => {
    const { UNSAFE_getByType } = renderWithProviders(<Spinner />);
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('uses the muted tone color when requested', () => {
    const { UNSAFE_getByType } = renderWithProviders(<Spinner tone="muted" />);
    const indicator = UNSAFE_getByType(ActivityIndicator);
    expect(indicator.props.color).toBeTruthy();
  });
});
