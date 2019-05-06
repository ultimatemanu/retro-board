import { useEffect } from 'react';
import useGlobalState from '../state';

export default () => {
  const { login } = useGlobalState();
  useEffect(() => {
    const username = localStorage.getItem('username');
    if (username) {
      login(username);
    }
  }, [login]);
};
