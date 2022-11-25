import React, { Fragment } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import './Cart.css';
import minusSquare from '../../images/minus-square.svg';
import plusSquare from '../../images/plus-square.svg';
import left from '../../images/left.svg';
import right from '../../images/right.svg';

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

class Cart extends React.Component {
  getTax21 = () => {
    const tax21 = ((this.props.getCartSum() * 0.21) / 1.21).toFixed(2);
    return tax21;
  };

  render() {
    return (
      <Fragment>
        <div className="cart">
          <h1>Cart</h1>

          {this.props.cart.map((cartItem, index) => {
            return (
              <Query
                query={PRODUCTDATA}
                variables={{ id: cartItem.productId }}
                fetchPolicy="no-cache"
              >
                {({ data, loading, error }) => {
                  if (loading) {
                    return <span>Cart item data loading here...</span>;
                  }
                  if (error) {
                    return <span>Some error here: {error.message}</span>;
                  }
                  return (
                    <div
                      key={cartItem.cartItemId}
                      className={
                        index + 1 === this.props.cart.length
                          ? 'cart-item last-cart-item'
                          : 'cart-item'
                      }
                    >
                      <div className="attributes-block">
                        <h2 className="bold-title">{data.product.brand}</h2>
                        <h2>{data.product.name}</h2>

                        {data.product.prices.map((price, index) => {
                          if (
                            price.currency.label === this.props.activeCurrency
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
                              <div key={cartItem.cartItemId + attribute.name}>
                                <h5>{attribute.name + ':'}</h5>
                                <div className="cart-size-group">
                                  {attribute.items.map((size) => (
                                    <button
                                      key={cartItem.cartItemId + size.id}
                                      id={
                                        cartItem.cartItemId +
                                        attribute.name +
                                        size.id
                                      }
                                      name={attribute.name}
                                      value={size.value}
                                      className={
                                        'cart-btn-size' +
                                        cartItem.selectedAttributes.map(
                                          (selectedAttribute) =>
                                            (selectedAttribute.attributeName ===
                                              attribute.name) &
                                            (selectedAttribute.attributeValue ===
                                              size.value)
                                              ? ' cart-btn-size-active '
                                              : ' '
                                        )
                                      }
                                    >
                                      {size.value}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            );
                          } else {
                            return (
                              <div key={cartItem.cartItemId + attribute.name}>
                                <h5>{attribute.name + ':'}</h5>

                                <div className="cart-color-group">
                                  {attribute.items.map((color) => {
                                    return (
                                      <div
                                        key={color.id}
                                        id={
                                          cartItem.cartItemId +
                                          attribute.name +
                                          color.id
                                        }
                                        name={attribute.name}
                                        value={color.value}
                                        className={
                                          'cart-btn-color ' +
                                          cartItem.selectedAttributes.map(
                                            (selectedAttribute) =>
                                              selectedAttribute.attributeValue ===
                                              color.value
                                                ? ' cart-btn-color-active '
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
                                              ? 'cart-btn-color-inside cart-btn-white-inside'
                                              : 'cart-btn-color-inside'
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
                      <div className="cart-picture-block">
                        <div className="cart-amount-group">
                          <div
                            className="cart-amount-button"
                            onClick={() => {
                              const id = cartItem.cartItemId;
                              this.props.incrementItems(id);
                            }}
                          >
                            <img src={plusSquare} alt="plus" />
                          </div>
                          <p>{cartItem.quantity}</p>

                          <div
                            className="cart-amount-button"
                            onClick={() => {
                              const id = cartItem.cartItemId;
                              this.props.decrementItems(id);
                            }}
                          >
                            <img src={minusSquare} alt="minus" />
                          </div>
                        </div>
                        <div className="cart-picture-container">
                          <img
                            className="cart-picture"
                            src={
                              data.product.gallery[cartItem.galleryCurrentIndex]
                            }
                            alt={data.product.name}
                          />
                          {data.product.gallery.length > 1 && (
                            <div className="picture-button-group">
                              <div
                                className="btn-cart-picture"
                                onClick={() => {
                                  const cartItemId = cartItem.cartItemId;
                                  const length = data.product.gallery.length;
                                  this.props.previousPicture(
                                    cartItemId,
                                    length
                                  );
                                }}
                              >
                                <img src={left} alt="show previous" />
                              </div>
                              <div
                                className="btn-cart-picture"
                                onClick={() => {
                                  const cartItemId = cartItem.cartItemId;
                                  const length = data.product.gallery.length;
                                  this.props.nextPicture(cartItemId, length);
                                }}
                              >
                                <img src={right} alt="show next" />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }}
              </Query>
            );
          })}

          <div className="cart-total-block">
            <div className="cart-total-labels">
              <h3>Tax 21%:</h3>
              <h3>Quantity:</h3>
              <h3 className="semi-bold-title">Total:</h3>
            </div>
            <div className="cart-total-numbers">
              <h3 className="bold-title">
                {this.props.activeCurrencySymbol} {this.getTax21()}
              </h3>
              <h3 className="bold-title">{this.props.itemsInCart}</h3>
              <h3 className="bold-title">
                {this.props.activeCurrencySymbol} {this.props.getCartSum()}
              </h3>
            </div>
          </div>
          <button className="btn-cart-primary">
            <span>order</span>
          </button>
        </div>
      </Fragment>
    );
  }
}

export default Cart;
