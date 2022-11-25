import React, { Fragment } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import parse from 'html-react-parser';
import withRouter from '../withrouter/withRouter';
import '../../App.css';
import './Pdp.css';

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

class Pdp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  addToCart = (event, allPrices, allAttributes, inStock) => {
    console.log(event.currentTarget.value);
    console.log(allPrices);
    console.log(allAttributes);
    console.log(this.props.selectedAttributes);

    const allAttributesSelected =
      this.props.selectedAttributes.length === allAttributes.length;
    console.log('All attributes selected? ' + allAttributesSelected);
    console.log('Product in stock? ' + inStock);

    const alertTextStock = 'This product is out of stock';
    const alertTextToCart = 'Product is added to cart';
    const alertTextAttributes = 'Please select options for this product';

    return inStock
      ? allAttributesSelected
        ? this.props.addToCart(event, allPrices) &
          this.props.showAlert(alertTextToCart)
        : this.props.showAlert(alertTextAttributes)
      : this.props.showAlert(alertTextStock) &
          this.props.clearSelectedAttributes();
  };

  render() {
    return (
      <Fragment>
        <Query
          query={PRODUCTDATA}
          variables={{ id: `${this.props.params.productId}` }}
          fetchPolicy="network-only"
        >
          {({ data, loading }) =>
            loading ? (
              <span>Product data is loading...</span>
            ) : (
              <div className="pdp">
                <div className="pdp-left-container">
                  {data.product.gallery.map((picture, index) => {
                    return (
                      <div key={index} className="small-picture-container">
                        <img
                          className="pdp-small-picture"
                          src={picture}
                          alt={data.product.name}
                          onClick={() => {
                            this.setState({ activePicture: picture });
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="pdp-middle-container">
                  <img
                    className="pdp-large-picture"
                    src={
                      this.state.activePicture
                        ? this.state.activePicture
                        : data.product.gallery[0]
                    }
                    alt={data.product.name}
                  />
                </div>
                <div className="pdp-right-container">
                  <h2>{data.product.brand}</h2>
                  <h3>{data.product.name}</h3>

                  {data.product.attributes.map((attribute) => {
                    if (attribute.type !== 'swatch') {
                      return (
                        <div key={data.product.id + attribute.name}>
                          <h5>{attribute.name + ':'}</h5>
                          <div className="size-group">
                            {attribute.items.map((sizeItem) => (
                              <button
                                key={sizeItem.id}
                                id={
                                  data.product.id + attribute.name + sizeItem.id
                                }
                                name={attribute.name}
                                value={sizeItem.value}
                                className={
                                  'btn-size' +
                                  this.props.selectedAttributes.map(
                                    (selectedAttribute) =>
                                      (selectedAttribute.attributeName ===
                                        attribute.name) &
                                      (selectedAttribute.attributeValue ===
                                        sizeItem.value)
                                        ? ' btn-size-active '
                                        : ' '
                                  )
                                }
                                onClick={(event) => {
                                  const productId = data.product.id;
                                  this.props.onAttributeSelect(
                                    event,
                                    productId
                                  );
                                }}
                              >
                                {sizeItem.value}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div key={data.product.id + attribute.name}>
                          <h5>{attribute.name + ':'}</h5>

                          <div className="color-group">
                            {attribute.items.map((color) => {
                              return (
                                <div
                                  key={color.id}
                                  id={attribute.name + color.id}
                                  name={attribute.name}
                                  value={color.value}
                                  className={
                                    'btn-color ' +
                                    this.props.selectedAttributes.map(
                                      (selectedAttribute) =>
                                        selectedAttribute.attributeValue ===
                                        color.value
                                          ? ' btn-color-active btn-white '
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
                                        ? 'btn-color-inside btn-white-inside'
                                        : 'btn-color-inside'
                                    }
                                    style={{ backgroundColor: color.value }}
                                    onClick={(event) => {
                                      const productId = data.product.id;
                                      this.props.onAttributeSelect(
                                        event,
                                        productId
                                      );
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
                  <h5>Price:</h5>
                  {data.product.prices.map((price, index) => {
                    if (price.currency.label === this.props.activeCurrency) {
                      return (
                        <h4 key={index}>
                          {price.currency.symbol + price.amount}
                        </h4>
                      );
                    } else return null;
                  })}

                  <button
                    className="btn-pdp-primary"
                    value={data.product.id}
                    onClick={(event) => {
                      const allPrices = data.product.prices;
                      const allAttributes = data.product.attributes;
                      const inStock = data.product.inStock;
                      this.addToCart(event, allPrices, allAttributes, inStock);
                    }}
                  >
                    <h6>Add to cart</h6>
                  </button>
                  <div className="pdp-description-text">
                    {parse(data.product.description)}
                  </div>
                </div>
              </div>
            )
          }
        </Query>
      </Fragment>
    );
  }
}

export default withRouter(Pdp);
