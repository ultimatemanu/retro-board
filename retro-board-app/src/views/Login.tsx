import React, { SFC, useCallback, useState } from 'react';
import { v4 } from 'uuid';
import {
  Dialog,
  DialogActions,
  DialogTitle,
  Button,
  DialogContent,
  Input,
} from '@material-ui/core';
import useTranslations from '../translations';
import useGlobalState from '../state';

const Login: SFC = () => {
  const translations = useTranslations();
  const { login } = useGlobalState();
  const [username, setUsername] = useState('');
  const loginHandler = useCallback(() => {
    const id = v4();
    login(username, id);
  }, [login, username]);
  const handleUsernameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value),
    [setUsername]
  );
  const handleClose = useCallback(() => {}, []);
  return (
    <Dialog
      fullScreen={false}
      open={true}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">Login</DialogTitle>
      <DialogContent>
        <Input
          value={username}
          onChange={handleUsernameChange}
          title={translations.Login.buttonLabel}
          placeholder={translations.Login.namePlaceholder}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={loginHandler} color="primary" autoFocus>
          Login
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Login;
