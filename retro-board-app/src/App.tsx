import React, { useState } from 'react';
import { hot } from 'react-hot-loader/root';
import { setConfig } from 'react-hot-loader';
import { BrowserRouter } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core';
import GlobalStyles from './GlobalStyles';
import { LanguageContext } from './translations';
import theme from './Theme';
import { Provider as StateContext } from './state';
import Layout from './Layout';

setConfig({
  ignoreSFC: true, // RHL will be __completely__ disabled for SFC
  pureRender: true, // RHL will not change render method
});

function App() {
  const [language, setLanguage] = useState('fr');
  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <LanguageContext.Provider value={{ language, setLanguage }}>
          <StateContext>
            <GlobalStyles />
            <Layout />
          </StateContext>
        </LanguageContext.Provider>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default hot(App);
