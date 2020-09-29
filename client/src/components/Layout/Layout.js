import React from 'react';
import Navigation from 'components/Navigation/Navigation';

const layout = (props) => {
        return(
            <React.Fragment>
                <Navigation loggedIn={props.loggedIn} displayName={props.displayName} />
                {props.children}
            </React.Fragment>
        )
}

export default layout;