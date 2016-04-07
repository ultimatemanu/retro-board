import { PropTypes } from 'react';
import noop from 'lodash/noop';
import Component from '../Component';
import Input from 'react-toolbox/lib/input';
import Button from 'react-toolbox/lib/button';
import { connect } from 'react-redux';
import { createSession, checkExistence } from '../state/session';
import translate from '../i18n/Translate';
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';
import { Tab, Tabs } from 'react-toolbox';
import icons from '../constants/icons';
import backgroundImage from '../components/images/background.jpg';
import { doesNameExists, isExistenceCheckPending } from '../selectors';

const stateToProps = state => ({
    doesNameExists: doesNameExists(state),
    isExistenceCheckPending: isExistenceCheckPending(state)
});

const actionsToProps = dispatch => ({
    createSession: () => dispatch(createSession()),
    createCustomSession: name => dispatch(createSession(name)),
    checkExistence: name => dispatch(checkExistence(name))
});

@translate('Join')
@connect(stateToProps, actionsToProps)
class Join extends Component {
    constructor(props) {
        super(props);
        this.state = { tabIndex: 0, customSessionName: '' };
    }
    render() {
        const { strings, checkExistence, doesNameExists, isExistenceCheckPending } = this.props;
        return (
            <div style={{padding: 20 }}>
            <Card raised>
                <CardTitle>{ strings.welcome }</CardTitle>
                <CardMedia >
                    <img src={backgroundImage} style={{ objectFit: 'cover', maxHeight: 150 }} />
                </CardMedia>
                <CardText>
                    <Tabs index={this.state.tabIndex} onChange={tabIndex => this.setState({ tabIndex })}>
                        <Tab label={ strings.standardTab.header }>
                            { strings.standardTab.text }<br /><br />
                            <Button label={ strings.standardTab.button } accent raised onClick={this.props.createSession} />
                        </Tab>
                        <Tab label={ strings.advancedTab.header }>
                            <Input label={ strings.advancedTab.input }
                                   required
                                   error={doesNameExists ? strings.advancedTab.alreadyExistsError : null }
                                   icon={icons.create}
                                   value={this.state.customSessionName}
                                   onChange={v => {
                                       checkExistence(v);
                                       this.setState({ customSessionName: v });
                                   }} />
                            <br />
                            <Button label={ strings.advancedTab.button } disabled={!this.state.customSessionName || doesNameExists !== false || isExistenceCheckPending} accent raised onClick={() => this.props.createCustomSession(this.state.customSessionName)} />
                        </Tab>
                    </Tabs>

                </CardText>
            </Card>
        </div>
        );
    }
}

Join.propTypes = {
    createSession: PropTypes.func,
    createCustomSession: PropTypes.func,
    checkExistence: PropTypes.func,
    doesNameExists: PropTypes.bool,
    isExistenceCheckPending: PropTypes.bool,
    strings: PropTypes.object
};

Join.defaultProps = {
    createSession: noop,
    createCustomSession: noop,
    checkExistence: noop,
    doesNameExists: false,
    isExistenceCheckPending: false,
    strings: {
        welcome: 'Welcome to Retrospected',
        standardTab: {
            header: 'Create a Session',
            text: 'Click below and start retrospecting:',
            button: 'Create a new session'
        },
        advancedTab: {
            header: 'Advanced',
            input: 'Enter a name for your session',
            button: 'Create custom session',
            alreadyExistsError: 'This name is already taken'
        }
    }
}


export default Join;
