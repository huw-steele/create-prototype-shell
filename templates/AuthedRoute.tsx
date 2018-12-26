module.exports = {
    filename: 'AuthedRoute.tsx',
    path: 'core',
    content: `import * as React from 'react';
import { Route, Redirect, RouteProps } from 'react-router';
import { connect } from 'react-redux';

interface OwnProps {
    component: any
}

interface StateProps {
    authed: boolean
}

type Props = OwnProps & StateProps & RouteProps;

const AuthedRoute : React.FunctionComponent<Props> = ({ component, authed, ...rest }: Props) => (
    <Route {...rest} render={(props) => authed ? React.createElement(component, props) : <Redirect to='/login' />} />
)

const mapStateToProps = (state: any): StateProps => ({
    authed: state.auth.username !== null
})

export default connect<StateProps, {}, OwnProps>(mapStateToProps)(AuthedRoute);
`
}