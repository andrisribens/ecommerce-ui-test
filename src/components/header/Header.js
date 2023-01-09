import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import withRouter from '../withrouter/withRouter';
import '../../App.css';
import './Header.css';
import logo from '../../images/a-logo.svg';
import cartIcon from '../../icons/empty-cart-icon.svg';
import keyboardArrowDownIcon from '../../icons/keyboard-arrow-down-icon.svg';
import CurrencySwitcher from '../currency-switcher/CurrencySwitcher';
import Minicart from '../minicart/Minicart';

const CATEGORYLIST = gql`
  query getCategoryList {
    categories {
      name
    }
  }
`;

class Header extends React.Component {
  render() {
    return (
      <Fragment>
        <div className="navbar">
          <div className="navbar-sector first-sector">
            <Query query={CATEGORYLIST} fetchPolicy="cache-and-network">
              {({ data, loading }) =>
                loading ? null : (
                  <div>
                    {data.categories.map((category) => {
                      return (
                        <Link to={category.name} key={category.name}>
                          <div
                            onClick={this.props.onCategoryClick}
                            title={category.name}
                            className={
                              this.props.activeCategory === category.name
                                ? 'menu-category-container category-active'
                                : 'menu-category-container'
                            }
                          >
                            <i className="menu-category" title={category.name}>
                              {category.name}
                            </i>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )
              }
            </Query>
          </div>
          <div className="navbar-sector">
            <img src={logo} alt="Company logo" />
          </div>
          <div className="navbar-sector last-sector">
            <Link>
              <div
                onClick={this.props.onCurrencySwitcherOpenClick}
                className="menu-currency-group"
              >
                <i className="menu-currency-symbol">
                  {this.props.activeCurrencySymbol}
                </i>
                <img
                  className="menu-keyboard-arrow-down-icon"
                  src={keyboardArrowDownIcon}
                  alt="Currency selector"
                />
              </div>
            </Link>

            <Link>
              <div
                onClick={this.props.onMinicartOpenClick}
                className="menu-cart-group"
              >
                <img src={cartIcon} alt="Cart" />
                {this.props.itemsInCart > 0 && (
                  <div className="quantity-badge">
                    <i>{this.props.itemsInCart}</i>
                  </div>
                )}
              </div>
            </Link>
          </div>

          <CurrencySwitcher
            isOpen={this.props.currencySwitcherIsOpen}
            activeCurrency={this.props.activeCurrency}
            activeCurrencySymbol={this.props.activeCurrencySymbol}
            onCurrencyClick={this.props.onCurrencyClick}
            onBackdropClick={this.props.onCurrencySwitcherOpenClick}
            onCurrencySwitcherOpenClick={this.props.onCurrencySwitcherOpenClick}
          />
          <Minicart
            minicartIsOpen={this.props.minicartIsOpen}
            onClick={this.props.onMinicartOpenClick}
            itemsInCart={this.props.itemsInCart}
            activeCurrency={this.props.activeCurrency}
            activeCurrencySymbol={this.props.activeCurrencySymbol}
            selectedAttributes={this.props.selectedAttributes}
            cart={this.props.cart}
            incrementItems={this.props.incrementItems}
            decrementItems={this.props.decrementItems}
            getCartSum={this.props.getCartSum}
          />
        </div>
      </Fragment>
    );
  }
}

export default withRouter(Header);
