import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { LocalStorage } from 'quasar';
import { api } from 'boot/axios';

export const useCartStore = defineStore( 'cart', () => {
  /**************** STATE ****************/
  const currentCart = ref( {
    products: [],
    total: 0
  } )
  /**************** STATE ****************/

  /**************** HELPERS ****************/

  function getCartFromLocalStorage () {
    return JSON.parse(LocalStorage.getItem('cart'))
  }

  function setCartToLocalStorage () {
    return LocalStorage.set( 'cart', JSON.stringify(currentCart.value) )
  }

  function getTotal () {
    const products = currentCart._rawValue.products
    const total = products.reduce((accumulator, object) => {
      return accumulator + (object.price * object.quantity)
    }, 0)
    return( total )
  }

  function setTotals () {
    currentCart.value.total = getTotal()
  }

  function getIndexByIdAndApi (id, isFakeStoreApi) {
    const products = currentCart.value.products
    return products.findIndex( (product) => (product.id === id) && (product.is_fake_store_api === isFakeStoreApi))
  }

  /**************** HELPERS ****************/

  /**************** GETTERS ****************/

  const getCurrentCart = computed( () => {
    return( currentCart.value )
  } )

  /**************** GETTERS ****************/

  /**************** ACTIONS ****************/

  function addProduct ( productInfo ) {
    const index = getIndexByIdAndApi( productInfo.id, productInfo.is_fake_store_api )
    if ( index === -1 ){
      currentCart.value.products.push(productInfo)
    } else {
      currentCart.value.products[index].quantity = ( currentCart.value.products[index].quantity + productInfo.quantity )
    }

    setCartToLocalStorage()
    setTotals()
  }

  function removeProduct ( productIndex ) {
    currentCart.value.products.splice(productIndex, 1)

    setCartToLocalStorage()
    setTotals()
  }

  function increaseProductQuantity ( productIndex ) {
    currentCart.value.products[productIndex].quantity += 1

    setCartToLocalStorage()
    setTotals()
  }

  function decreaseProductQuantity ( productIndex ) {
    currentCart.value.products[productIndex].quantity -= 1

    if (currentCart.value.products[productIndex].quantity === 0) {
      currentCart.value.products.splice(productIndex, 1)
    }

    setCartToLocalStorage()
    setTotals()
  }

  function loadFromLocalStorage () {
    const cartLocalStorage = getCartFromLocalStorage()
    if (cartLocalStorage !== null && cartLocalStorage.products.length !== 0) {
      currentCart.value = cartLocalStorage
    }
  }

  function resetCurrentCart () {
    currentCart.value.products = []
    currentCart.value.total = 0

    setCartToLocalStorage()
  }

  // Send data to api
  function sendDataToApi () {
    const dataToSend = {
      total: currentCart.value.total,
      products: JSON.stringify( currentCart.value.products )
    }

    api.post( '/carts', dataToSend ).catch( ( error ) => {
      console.error( error )
    } )
  }

  function getCurrentStock (id, isFakeStoreApi = undefined) {
    const index = getIndexByIdAndApi(id, isFakeStoreApi)
    if ( index !== -1 ) {
      const product = currentCart.value.products[index]
      return product.stock - product.quantity
    }
    return -1
  }

  /**************** ACTIONS ****************/

  return( {
    getCurrentCart,
    getTotal,
    getCurrentStock,
    addProduct,
    removeProduct,
    increaseProductQuantity,
    decreaseProductQuantity,
    loadFromLocalStorage,
    resetCurrentCart,
    sendDataToApi
  } )
} )
