import React from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../withrouter/withRouter';
import '../../App.css';
import './Plp.css';
import cartIcon from '../../icons/white-empty-cart.svg';

class ProductCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addToCartIconIsShown: false,
    };
  }

  showCartIcon = () => {
    this.setState({ addToCartIconIsShown: true });
  };

  hideCartIcon = () => {
    this.setState({ addToCartIconIsShown: false });
  };

  plpHandleAddToCart = (event, allPrices) => {
    event.preventDefault();
    if (this.props.attributes.length === 0) {
      this.props.addToCart(event, allPrices);
      const alertTextToCart = 'Product is added to cart';
      this.props.showAlert(alertTextToCart);
      console.log('Product is added to cart. ||' + event.currentTarget.value);
    } else {
      const alertText =
        'Please select product options on product page. Product is not added to cart. ';
      this.props.showAlert(alertText);
      console.log(
        'This product has attributes. Must be selected on PDP. Not added to cart ||' +
          event.currentTarget.value
      );
    }
  };

  render() {
    return (
      <Link
        to={`/${this.props.params.categoryName}/${this.props.productId}`}
        key={this.props.productId}
        onMouseEnter={this.showCartIcon}
        onMouseLeave={this.hideCartIcon}
      >
        <div className="product-card">
          <div className="plp-product-image-block">
            <img
              className="plp-product-image"
              src={this.props.image}
              alt={this.props.product}
            />
            {!this.props.inStock && <h2>out of stock</h2>}
            {this.state.addToCartIconIsShown & this.props.inStock ? (
              <button
                className="add-to-cart-sign"
                onClick={(event) => {
                  const allPrices = this.props.allPrices;
                  this.plpHandleAddToCart(event, allPrices);
                }}
                value={this.props.productId}
              >
                <img
                  className="add-to-cart-sign-icon"
                  src={cartIcon}
                  alt="Add to cart"
                />
              </button>
            ) : null}
          </div>
          <h3>{this.props.brand + ' ' + this.props.product}</h3>
          <h4>{this.props.price}</h4>
          {!this.props.inStock && <div className="white-layer"></div>}
        </div>
      </Link>
    );
  }
}

export default withRouter(ProductCard);
