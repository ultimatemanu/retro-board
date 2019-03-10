import React, { useContext, useCallback } from 'react';
import styled from 'styled-components';
import { Route } from 'react-router-dom';
import { Drawer } from '@material-ui/core';
import useTranslations, { LanguageContext } from '../translations';
import useGlobalState from '../state';
import LanguagePicker from '../components/LanguagePicker';
import PlayerList from './panel/PlayerList';
import SummaryModeSwitch from './panel/SummaryModeSwitch';

function Panel() {
  const translations = useTranslations();
  const languageContext = useContext(LanguageContext);
  const { state, togglePanel } = useGlobalState();

  return (
    <Drawer open={state.panelOpen} onClose={togglePanel}>
      <LanguagePicker
        value={languageContext.language}
        onChange={languageContext.setLanguage}
      />
      <Content>
        <Route path="/game/:gameId" component={SummaryModeSwitch} />
      </Content>
      <Content>
        <Route path="/game/:gameId" component={PlayerList} />
      </Content>
    </Drawer>
  );
}

const Content = styled.div`
  padding: 10px;

  @media screen and (max-width: 600px) {
    padding: 3px;
  }
`;

export default Panel;
