import React, { Fragment } from 'react';
import UploadForm from '../components/UploadForm.jsx';
import { useAuth0 } from '../utils/react-auth0-spa';

const Upload = () => {
    const { isAuthenticated, loginWithRedirect } = useAuth0();

    return (
        <Fragment>
            {!isAuthenticated && (
                <button id="qsLoginBtn" color="primary" className="btn-margin" onClick={() => loginWithRedirect({})}>
                    Log in
                </button>
            )}

            {isAuthenticated && <UploadForm />}
        </Fragment>
    );
};

export default Upload;

