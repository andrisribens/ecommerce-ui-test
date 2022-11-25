import React, { Fragment } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Header from './components/header/Header';
import Alert from './components/alert/Alert';
import Pdp from './components/pdp/Pdp';
import Plp from './components/plp/Plp';
import Cart from './components/cart/Cart';
import withRouter from './components/withrouter/withRouter.js';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      minicartIsOpen: false,
      currencySwitcherIsOpen: false,
      activeCategory: 'all',
      activeCurrency: 'USD',
      activeCurrencySymbol: '$',
      itemsInCart: 0,
      newAttribute: { attributeName: '', attributeValue: '' },
      selectedAttributes: [],
      cart: [],
      newCartItem: {
        cartItemId: ' ',
        productId: ' ',
        quantity: ' ',
        selectedAttributes: [],
      },
      alertIsOpen: false,
      alertText: 'Have a nice day!',
    };
  }

  componentDidMount() {
    const data = window.localStorage.getItem('SCANDI_STATE');
    if (data !== null) this.setState(JSON.parse(data));
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    window.localStorage.setItem('SCANDI_STATE', JSON.stringify(nextState));
  }

  handleCurrencySwitcherOpen = () => {
    this.setState({
      currencySwitcherIsOpen: !this.state.currencySwitcherIsOpen,
      minicartIsOpen: false,
    });
  };

  handleActiveCurrency = (event, symbol) => {
    this.setState({
      activeCurrency: event.target.id,
      activeCurrencySymbol: symbol,
      currencySwitcherIsOpen: false,
    });
  };

  handleMinicartOpen = () => {
    this.setState({
      minicartIsOpen: !this.state.minicartIsOpen,
      currencySwitcherIsOpen: false,
    });
  };

  handleCategoryClick = (event) => {
    this.setState({ activeCategory: event.target.title });
  };

  onAttributeSelect = (event, productId) => {
    console.log(event.target);
    const currentList = this.state.selectedAttributes;
    const newAttribute = {
      attributeName: event.target.name,
      attributeValue: event.target.value,
      attributeId: productId + event.target.name + event.target.value,
    };

    const changedList = currentList.map((attribute) => {
      if (attribute.attributeName === newAttribute.attributeName) {
        return { ...attribute, attributeValue: event.target.value };
      } else {
        return attribute;
      }
    });
    this.setState({
      newAttribute: newAttribute,
      selectedAttributes: changedList,
    });

    const longerList = changedList.filter((attribute) => {
      if (attribute.attributeName !== newAttribute.attributeName)
        return [changedList, newAttribute];
    });
    this.setState({
      selectedAttributes: [...longerList, newAttribute],
    });
  };

  addToCart = (event, allPrices) => {
    const selectedAttributesGroupId = this.state.selectedAttributes.map(
      (attribute) => {
        return attribute.attributeId;
      }
    );
    const selectedAttributesGroupIdString = JSON.stringify(
      selectedAttributesGroupId.sort()
    );
    this.setState({
      selectedAttributesGroupIdString: selectedAttributesGroupIdString,
    });

    const cartItemId =
      event.currentTarget.value + selectedAttributesGroupIdString;

    const newCartItem = {
      productId: event.currentTarget.value,
      cartItemId: cartItemId,
      quantity: 1,
      selectedAttributes: this.state.selectedAttributes,
      galleryCurrentIndex: 0,
      allPrices: allPrices,
    };

    this.setState({
      newCartItem: newCartItem,
      selectedAttributes: [],
      itemsInCart: this.state.itemsInCart + 1,
    });

    const cart = this.state.cart;

    if (cart.length === 0) {
      this.setState({
        cart: [newCartItem],
      });
    } else {
      const incrementedCart = cart.map((cartItem) => {
        if (cartItem.cartItemId === newCartItem.cartItemId) {
          return { ...cartItem, quantity: cartItem.quantity + 1 };
        } else {
          return cartItem;
        }
      });

      this.setState({
        cart: incrementedCart,
      });

      const findSameItem = incrementedCart.some(
        (cartItem) => cartItem.cartItemId === newCartItem.cartItemId
      );

      console.log('Is there any item like this? - ' + findSameItem);
      !findSameItem &&
        this.setState({ cart: [...incrementedCart, newCartItem] });
    }
  };

  clearSelectedAttributes = () => {
    this.setState({
      selectedAttributes: [],
    });
  };

  incrementItems = (id) => {
    const incrementedCart = this.state.cart.map((cartItem) => {
      if (id === cartItem.cartItemId) {
        return { ...cartItem, quantity: cartItem.quantity + 1 };
      } else {
        return cartItem;
      }
    });
    this.setState({
      cart: incrementedCart,
      itemsInCart: this.state.itemsInCart + 1,
    });
  };

  decrementItems = (id) => {
    const decrementedCart = this.state.cart.map((cartItem) => {
      if (id === cartItem.cartItemId) {
        return { ...cartItem, quantity: cartItem.quantity - 1 };
      } else {
        return cartItem;
      }
    });
    const positiveDecrementedCart = decrementedCart.filter(
      (cartItem) => cartItem.quantity > 0
    );
    this.setState({
      cart: positiveDecrementedCart,
      itemsInCart: this.state.itemsInCart - 1,
    });
  };

  nextPicture = (cartItemId, length) => {
    const nextPictureCart = this.state.cart.map((cartItem) => {
      if (
        (cartItemId === cartItem.cartItemId) &
        (length - 1 > cartItem.galleryCurrentIndex)
      ) {
        return {
          ...cartItem,
          galleryCurrentIndex: cartItem.galleryCurrentIndex + 1,
        };
      } else {
        return cartItem;
      }
    });
    this.setState({
      cart: nextPictureCart,
    });
  };

  previousPicture = (cartItemId) => {
    const previousPictureCart = this.state.cart.map((cartItem) => {
      if (
        (cartItemId === cartItem.cartItemId) &
        (cartItem.galleryCurrentIndex > 0)
      ) {
        return {
          ...cartItem,
          galleryCurrentIndex: cartItem.galleryCurrentIndex - 1,
        };
      } else {
        return cartItem;
      }
    });
    this.setState({
      cart: previousPictureCart,
    });
  };

  getCartSum = () => {
    const value = this.state.cart.map((cartItem) => {
      return cartItem.allPrices
        .map((onePrice) => {
          const amount = onePrice.amount;
          const quantity = cartItem.quantity;
          if (onePrice.currency.label === this.state.activeCurrency) {
            return amount * quantity;
          } else {
            return null;
          }
        })
        .reduce((partialSum, a) => partialSum + a, 0);
    });
    console.log(value);

    const valueSum = value
      .reduce((partialSum, a) => partialSum + a, 0)
      .toFixed(2);

    console.log(valueSum);

    return valueSum;
  };

  showAlert = (alertTextToCart, alertTextStock, alertTextAttributes) => {
    this.setState({
      alertText: alertTextToCart || alertTextStock || alertTextAttributes,
      alertIsOpen: true,
    });
    setTimeout(() => this.setState({ alertIsOpen: false }), 5000);
  };

  closeAlert = () => {
    this.setState({ alertIsOpen: false });
  };

  render() {
    return (
      <Fragment>
        <Router>
          <Header
            minicartIsOpen={this.state.minicartIsOpen}
            onMinicartOpenClick={this.handleMinicartOpen}
            currencySwitcherIsOpen={this.state.currencySwitcherIsOpen}
            onCurrencySwitcherOpenClick={this.handleCurrencySwitcherOpen}
            onCurrencyClick={this.handleActiveCurrency}
            activeCategory={this.state.activeCategory}
            onCategoryClick={this.handleCategoryClick}
            activeCurrency={this.state.activeCurrency}
            activeCurrencySymbol={this.state.activeCurrencySymbol}
            itemsInCart={this.state.itemsInCart}
            selectedAttributes={this.state.selectedAttributes}
            cart={this.state.cart}
            incrementItems={this.incrementItems}
            decrementItems={this.decrementItems}
            getCartSum={this.getCartSum}
          />
          <Alert
            alertIsOpen={this.state.alertIsOpen}
            alertText={this.state.alertText}
            actionAlertIsOpen={this.state.actionAlertIsOpen}
            closeAlert={this.closeAlert}
          />
          <Routes>
            <Route
              path="/"
              element={<Navigate to={this.state.activeCategory} replace />}
            />

            <Route
              path=":categoryName"
              element={
                <Plp
                  activeCurrency={this.state.activeCurrency}
                  addToCart={this.addToCart}
                  newCartItem={this.state.newCartItem}
                  cart={this.state.cart}
                  showAlert={this.showAlert}
                />
              }
            />
            <Route
              path=":categoryName/:productId"
              element={
                <Pdp
                  activeCurrency={this.state.activeCurrency}
                  onAttributeSelect={this.onAttributeSelect}
                  newAttribute={this.state.newAttribute}
                  selectedAttributes={this.state.selectedAttributes}
                  addToCart={this.addToCart}
                  newCartItem={this.state.newCartItem}
                  cart={this.state.cart}
                  clearSelectedAttributes={this.clearSelectedAttributes}
                  alertIsOpen={this.state.alertIsOpen}
                  showAlert={this.showAlert}
                />
              }
            />
            <Route
              path="cart"
              element={
                <Cart
                  activeCurrency={this.state.activeCurrency}
                  activeCurrencySymbol={this.state.activeCurrencySymbol}
                  cart={this.state.cart}
                  itemsInCart={this.state.itemsInCart}
                  totalOrderValue={this.state.totalOrderValue}
                  incrementItems={this.incrementItems}
                  decrementItems={this.decrementItems}
                  nextPicture={this.nextPicture}
                  previousPicture={this.previousPicture}
                  getCartSum={this.getCartSum}
                  showAlert={this.showAlert}
                />
              }
            />
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </Router>
      </Fragment>
    );
  }
}

class NotFound extends React.Component {
  render() {
    return (
      <div>
        <h1>Nothing is here. Go home!</h1>
      </div>
    );
  }
}

export default withRouter(App);
