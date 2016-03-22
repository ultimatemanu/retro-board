import React from 'react';
import ClassNames from 'classnames';
import 'material-design-icons/sprites/css-sprite/sprite-av-black.css';

const FontIcon = ({ children, className, value, ...other}) => {
  const classes = ClassNames(
    {'material-icons': typeof value === 'string'},
    className
  );
  // return (
  //   <span className={classes} {...other} data-react-toolbox='font-icon' style={{ outline: '1px solid red'}}>
  //     {value}
  //     {children}
  //   </span>
  // );
  return (
      <div class="icon icon-ic_play_circle_outline_black_24dp"></div>
  );
};

FontIcon.propTypes = {
  children: React.PropTypes.any,
  className: React.PropTypes.string,
  value: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.element
  ])
};

FontIcon.defaultProps = {
  className: ''
};

export default FontIcon;
