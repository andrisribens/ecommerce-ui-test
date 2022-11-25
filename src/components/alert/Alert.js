import React, { Fragment } from 'react';
import './Alert.css';
import Line from '../../images/line.svg';

class Alert extends React.Component {
  render() {
    return (
      <Fragment>
        {this.props.alertIsOpen && (
          <div className="alert">
            {this.props.alertText}
            <div className="close-rect" onClick={this.props.closeAlert}>
              <img src={Line} alt="Close" className="line-one" />
              <img src={Line} alt="Close" className="line-two" />
            </div>
          </div>
        )}
      </Fragment>
    );
  }
}

export default Alert;
