import React, { Fragment } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import './CurrencySwitcher.css';

const CURRENCYLIST = gql`
  query getCurrencyList {
    currencies {
      symbol
      label
    }
  }
`;

class CurrencySwitcher extends React.Component {
  render() {
    return (
      <Fragment>
        {this.props.isOpen ? (
          <>
            <div className="currency-list">
              <Query query={CURRENCYLIST} fetchPolicy="cache-and-network">
                {({ data, loading, error }) => {
                  if (loading) {
                    return null;
                  }
                  if (error) {
                    return <p>{error.message}</p>;
                  }
                  if (data) {
                    return data.currencies.map((currency) => {
                      return (
                        <div
                          key={currency.label}
                          id={currency.label}
                          className="currency-list-item"
                          onClick={(event, symbol) => {
                            symbol = currency.symbol;
                            this.props.onCurrencyClick(event, symbol);
                          }}
                        >
                          <p
                            id={currency.label}
                            symbol={currency.symbol}
                            className="currency-text"
                          >
                            {currency.symbol + ' ' + currency.label}
                          </p>
                        </div>
                      );
                    });
                  }
                }}
              </Query>
            </div>
            <div
              className="currencyswitch-backdrop"
              onClick={this.props.onBackdropClick}
            ></div>
          </>
        ) : null}
      </Fragment>
    );
  }
}

export default CurrencySwitcher;
