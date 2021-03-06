import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { signIn, signOut } from '../../actions/auth';

import Button from '@material-ui/core/Button';

import styles from './index.module.scss';
import GoogleIcon from '../../images/google.png';

const GoogleAuth = ({ isSignedIn, signIn, signOut }) => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    window.gapi.load('client:auth2', () => {
      window.gapi.client.init({
        clientId: '663521848786-kg6cjje1o3dkg3h66547eaaf44qat5a6.apps.googleusercontent.com',
        scope: 'email',
      });

      setAuth(() => window.gapi.auth2.getAuthInstance());
    });
  }, []);

  useEffect(() => {
    if (auth !== null) {
      auth.isSignedIn.listen(onAuthChange);
      onAuthChange(auth.isSignedIn.get());
    }
  }, [auth]);

  const onAuthChange = (isSignedIn) => {
    if (isSignedIn) {
      const userId = auth.currentUser.get().getId();
      signIn(userId);
    } else {
      signOut();
    }
  };

  if (isSignedIn === null) {
    return null;
  } else if (isSignedIn) {
    return (
      <Button
        className={styles.auth_button}
        variant="outlined"
        color="primary"
        onClick={() => auth.signOut()}
      >
        登出
      </Button>
    );
  } else {
    return (
      <Button
        className={styles.auth_button}
        variant="outlined"
        color="primary"
        onClick={() => auth.signIn(auth)}
      >
        <img src={GoogleIcon} alt="google" /> 登入
      </Button>
    );
  }
};

const mapStateToProps = (state) => {
  return { isSignedIn: state.auth.isSignedIn };
};

export default connect(mapStateToProps, {
  signIn,
  signOut,
})(GoogleAuth);
