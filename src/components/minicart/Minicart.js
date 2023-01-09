import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import './Minicart.css';
import minusSquare from '../../images/minicart-minus-square.svg';
import plusSquare from '../../images/minicart-plus-square.svg';

const PRODUCTDATA = gql`
  query ProductInfo($id: String!) {
    product(id: $id) {
      id
      brand
      name
      inStock
      gallery
      description
      category
      attributes {
        id
        name
        type
        items {
          id
          displayValue
          value
        }
      }

      prices {
        currency {
          label
          symbol
        }
        amount
      }
    }
  }
`;

class Minicart extends React.Component {
  render() {
    return (
      <Fragment>
        {this.props.minicartIsOpen ? (
          <>
            <div className="minicart">
              <h1>
                My Bag,{' '}
                <span style={{ fontWeight: '500' }}>
                  {this.props.itemsInCart === 1
                    ? this.props.itemsInCart + ' item'
                    : this.props.itemsInCart === null
                    ? 'no items'
                    : this.props.itemsInCart + ' items'}
                </span>
              </h1>
              {this.props.cart.map((cartItem) => {
                return (
                  <Query
                    query={PRODUCTDATA}
                    variables={{ id: cartItem.productId }}
                    fetchPolicy="no-cache"
                  >
                    {({ data, loading, error }) => {
                      if (loading) {
                        return null;
                      }
                      if (error) {
                        return <span>{error.message}</span>;
                      }
                      return (
                        <div
                          className="minicart-item"
                          key={cartItem.cartItemId}
                        >
                          <div className="minicart-attributes-block">
                            <h2>
                              {data.product.brand} <br /> {data.product.name}
                            </h2>

                            {data.product.prices.map((price, index) => {
                              if (
                                price.currency.label ===
                                this.props.activeCurrency
                              ) {
                                return (
                                  <h4 key={index}>
                                    {price.currency.symbol + price.amount}
                                  </h4>
                                );
                              } else return null;
                            })}

                            {data.product.attributes.map((attribute) => {
                              if (attribute.type !== 'swatch') {
                                return (
                                  <div
                                    key={cartItem.cartItemId + attribute.name}
                                  >
                                    <h5>{attribute.name + ':'}</h5>
                                    <div className="minicart-size-group">
                                      {attribute.items.map((sizeItem) => (
                                        <button
                                          key={
                                            cartItem.cartItemId + sizeItem.id
                                          }
                                          id={
                                            cartItem.productId +
                                            attribute.name +
                                            sizeItem.id
                                          }
                                          className={
                                            'minicart-btn-size' +
                                            cartItem.selectedAttributes.map(
                                              (selectedAttribute) =>
                                                (selectedAttribute.attributeName ===
                                                  attribute.name) &
                                                (selectedAttribute.attributeValue ===
                                                  sizeItem.value)
                                                  ? ' minicart-btn-size-active '
                                                  : ' '
                                            )
                                          }
                                        >
                                          {sizeItem.value}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                );
                              } else {
                                return (
                                  <div
                                    key={cartItem.cartItemId + attribute.name}
                                  >
                                    <h5>{attribute.name + ':'}</h5>

                                    <div className="minicart-color-group">
                                      {attribute.items.map((color) => {
                                        return (
                                          <div
                                            key={color.id}
                                            id={attribute.name + color.id}
                                            name={attribute.name}
                                            value={color.value}
                                            className={
                                              'minicart-btn-color ' +
                                              cartItem.selectedAttributes.map(
                                                (selectedAttribute) =>
                                                  selectedAttribute.attributeValue ===
                                                  color.value
                                                    ? ' minicart-btn-color-active minicart-btn-white '
                                                    : ' '
                                              )
                                            }
                                          >
                                            <button
                                              key={color.id}
                                              id={attribute.name + color.id}
                                              name={attribute.name}
                                              value={color.value}
                                              className={
                                                color.value === '#FFFFFF'
                                                  ? 'minicart-btn-color-inside minicart-btn-white-inside'
                                                  : 'minicart-btn-color-inside'
                                              }
                                              style={{
                                                backgroundColor: color.value,
                                              }}
                                            ></button>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              }
                            })}
                          </div>

                          <div className="minicart-picture-block">
                            <div className="minicart-amount-group">
                              <div
                                className="minicart-amount-button"
                                onClick={() => {
                                  const id = cartItem.cartItemId;
                                  this.props.incrementItems(id);
                                  console.log(id);
                                }}
                              >
                                <img src={plusSquare} alt="plus" />
                              </div>
                              <p>{cartItem.quantity}</p>
                              <div
                                className="minicart-amount-button"
                                onClick={() => {
                                  const id = cartItem.cartItemId;
                                  const quantity = cartItem.quantity;
                                  this.props.decrementItems(id, quantity);
                                  console.log(id);
                                }}
                              >
                                <img src={minusSquare} alt="minus" />
                              </div>
                            </div>
                            <div className="minicart-picture-container">
                              <img
                                className="minicart-picture"
                                src={data.product.gallery[0]}
                                alt={data.product.name}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  </Query>
                );
              })}
              <div className="minicart-total-block">
                <div className="minicart-total-labels">
                  <h3>Total</h3>
                </div>
                <div className="minicart-total-numbers">
                  <h3>
                    {this.props.activeCurrencySymbol}
                    {this.props.getCartSum()}
                  </h3>
                </div>
              </div>
              <div className="minicart-btn-block">
                <Link to="/cart" className="minicart-btn-container">
                  <button
                    className="btn-minicart btn-secondary"
                    onClick={this.props.onClick}
                  >
                    <span>view bag</span>
                  </button>
                </Link>
                {/* <Link to="/" className="minicart-btn-container"> */}
                <button
                  className="btn-minicart btn-primary"
                  // onClick={this.props.onClick}
                >
                  <span>check out</span>
                </button>
                {/* </Link> */}
              </div>
            </div>
            <div
              className="minicart-backdrop"
              onClick={this.props.onClick}
            ></div>
          </>
        ) : null}
      </Fragment>
    );
  }
}

export default Minicart;
