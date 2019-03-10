import React, { useCallback } from 'react';
import styled from 'styled-components';
import shortid from 'shortid';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import {
  Button,
  Card,
  CardMedia,
  Typography,
  CardContent,
  CardActions,
  withStyles,
} from '@material-ui/core';
import useTranslations from '../translations';
import PreviousGames from './home/PreviousGames';
import logo from './home/logo.png';

interface HomeProps extends RouteComponentProps {}

const styles = {
  card: {
    // maxWidth: 345,
  },
  media: {
    objectFit: 'cover',
  },
};

function Home(props: HomeProps) {
  const translations = useTranslations();
  const createSession = useCallback(() => {
    props.history.push('/game/' + shortid());
  }, [props.history]);
  return (
    <>
      <MainCard>
        <CardMedia image={logo} component="img" title="Retrospected" />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {translations.Join.welcome}
          </Typography>
          <Typography component="p">
            {translations.Join.standardTab.text}
          </Typography>
        </CardContent>
        <CardActions>
          <Button onClick={createSession} variant="contained" color="secondary">
            {translations.Join.standardTab.button}
          </Button>
        </CardActions>
      </MainCard>
      <MainCard>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Previous Games
          </Typography>
          <PreviousGames />
        </CardContent>
      </MainCard>
    </>
  );
}

const MainCard = styled(Card)`
  max-width: 800px;
  margin: auto;
  margin-bottom: 20px;
`;
export default withStyles(styles as any)(withRouter(Home));
