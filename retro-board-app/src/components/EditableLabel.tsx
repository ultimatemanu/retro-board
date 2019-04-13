import React, { Component } from 'react';
import styled from 'styled-components';
import { Edit } from '@material-ui/icons';

interface EditableLabelProps extends CenteredProp {
  value: string;
  readOnly?: boolean;
  placeholder?: string;
  label?: string;
  onChange: (value: string) => void;
}

interface CenteredProp {
  centered?: boolean;
}

interface EditableLabelState {
  editMode: boolean;
}

export default class EditableLabel extends Component<
  EditableLabelProps,
  EditableLabelState
> {
  inputRef: React.RefObject<HTMLTextAreaElement>;
  constructor(props: EditableLabelProps) {
    super(props);
    this.state = { editMode: false };
    this.inputRef = React.createRef<HTMLTextAreaElement>();
  }

  onKeyPress(e: KeyboardEvent) {
    if (e.keyCode === 13) {
      this.setState({ editMode: false });
    }
  }

  renderReadOnlyMode() {
    const { value, placeholder } = this.props;

    return <ViewMode>{value || placeholder}</ViewMode>;
  }

  renderViewMode() {
    const { value, placeholder, readOnly, label } = this.props;

    if (readOnly) {
      return this.renderReadOnlyMode();
    }

    return (
      <ViewMode
        onClick={() =>
          this.setState({ editMode: true }, () =>
            this.inputRef.current!.focus()
          )
        }
      >
        <span aria-label={label}>{value || placeholder}</span>
        &nbsp;
        <EditIcon fontSize="inherit" />
      </ViewMode>
    );
  }

  renderEditMode() {
    const { value, onChange, label } = this.props;
    return (
      <EditMode>
        <textarea
          ref={this.inputRef}
          aria-label={`${label} input`}
          value={value}
          onBlur={() => {
            this.setState({ editMode: false });
          }}
          onKeyPress={e => this.onKeyPress(e.nativeEvent)}
          onChange={v => {
            onChange(v.target.value);
          }}
        />
      </EditMode>
    );
  }

  render() {
    return (
      <LabelContainer>
        {this.state.editMode ? this.renderEditMode() : this.renderViewMode()}
      </LabelContainer>
    );
  }
}

const LabelContainer = styled.span``;

const ViewMode = styled.span``;

const EditMode = styled.span<CenteredProp>`
  margin: auto;

  textarea {
    width: 100%;
    background: none;
    border: none;
    outline: none;
    font-size: inherit;
    text-align: ${props => (props.centered ? 'center' : 'inherit')};
  }
`;

const EditIcon = styled(Edit)`
  font-size: 0.1em;
`;
