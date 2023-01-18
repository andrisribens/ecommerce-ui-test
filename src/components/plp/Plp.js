import React, { Fragment } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import withRouter from '../withrouter/withRouter';
import ProductCard from './ProductCard';
import '../../App.css';
import './Plp.css';

const PRODUCTLIST = gql`
  query getProductList($input: CategoryInput) {
    category(input: $input) {
      name
      products {
        id
        brand
        name
        inStock
        gallery
        attributes {
          id
          items {
            id
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
  }
`;

class Plp extends React.Component {
  render() {
    return (
      <Fragment>
        <Query
          query={PRODUCTLIST}
          variables={{
            input: { title: `${this.props.params.categoryName}` },
          }}
          // fetchPolicy="cache-and-network"
        >
          {({ data, loading, error }) => {
            if (!data) {
              return <span> NAV DATU </span>;
            }
            if (loading) {
              return null;
            }
            if (error) {
              return <span>{error.message}</span>;
            }
            return (
              <div className="plp">
                <h1>{data.category.name}</h1>
                <div className="plp-content">
                  {data.category.products.map((product) => {
                    return (
                      <ProductCard
                        key={product.id}
                        categoryName={data.category.name}
                        productId={product.id}
                        image={product.gallery[0]}
                        inStock={product.inStock}
                        brand={product.brand}
                        product={product.name}
                        attributes={product.attributes}
                        addToCart={this.props.addToCart}
                        price={product.prices.map((price) => {
                          if (
                            price.currency.label === this.props.activeCurrency
                          ) {
                            return price.currency.symbol + price.amount;
                          } else return null;
                        })}
                        allPrices={product.prices}
                        showAlert={this.props.showAlert}
                      />
                    );
                  })}
                </div>
              </div>
            );
          }}
        </Query>
      </Fragment>
    );
  }
}

export default withRouter(Plp);
