import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import useTranslations from '../../translations';
import useGlobalState from '../../state';

const SummaryModeSwitch = () => {
  const translations = useTranslations();
  const {
    state: { summaryMode },
    toggleSummaryMode,
  } = useGlobalState();
  return (
    <FormGroup>
      <FormControlLabel
        label={translations.Header.summaryMode}
        control={
          <Switch
            color="primary"
            checked={summaryMode}
            onChange={toggleSummaryMode}
          />
        }
      />
    </FormGroup>
  );
};

export default SummaryModeSwitch;
