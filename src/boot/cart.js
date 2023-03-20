import { boot } from 'quasar/wrappers'
import { useCartStore } from 'stores/cart'

const cartStore = useCartStore()

export default boot(() => {
  cartStore.loadFromLocalStorage()
})
