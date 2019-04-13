import React, { useEffect } from 'react';
import { render, RenderOptions, RenderResult } from 'react-testing-library';
import { Provider, initialState } from '../state/context';
import useGlobalState from '../state';
import { State } from '../state/types';
// import { ThemeProvider } from 'my-ui-lib'
// import { TranslationProvider } from 'my-i18n-lib'
// import defaultStrings from 'i18n/en-x-default'

const testingInitialState: State = {
  ...initialState,
  username: 'John Doe',
};

const AllTheProviders: React.SFC = ({ children }) => {
  return <Provider initialState={testingInitialState}>{children}</Provider>;
};
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
const customRender = (
  ui: React.ReactElement<any>,
  options?: Omit<RenderOptions, 'queries'>
): RenderResult => render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from 'react-testing-library';

// override render method
export { customRender as render };
