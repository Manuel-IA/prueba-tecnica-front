<template>
  <div class="q-pa-md">
    <q-btn-dropdown
      v-if="cartStore.products.length > 0"
      unelevated
      icon="shopping_cart"
      color="primary"
      label="Cart"
    >
      <q-card flat bordered class="my-card">
        <q-card-section class="text-center">
          <!-- Reset Cart -->
          <div class="text-left" >
            <q-btn
              label="Clear"
              size="12px"
              icon="delete"
              color="negative"
              @click="confirmReset"
            />
          </div>

          <span class="text-h5 text-bold text-center">Shopping Cart</span>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-list separator v-for="(product, index) in cartStore.products">
            <q-item>
              <q-item-section>
                <div class="row inline">
                  <div class="col-10">
                    <div class="row">
                      <div class="col">
                        <div class="q-mt-sm" style="font-size: 1.1rem;">
                          <span class="text-bold">{{ product.title }}</span>
                          <br />
                          <span class="text-body2">
                            ${{ product.price }}
                          </span>
                        </div>
                      </div>
                      <div class="col">
                        <q-input bottom-slots v-model="product.quantity" :dense="true" readonly>
                          <template v-slot:prepend>
                            <q-btn round dense flat icon="remove" @click="decrease(index)" />
                          </template>

                          <template v-slot:hint>
                            Subtotal ${{ product.quantity * product.price }}
                          </template>

                          <template v-slot:append>
                            <q-btn round dense flat icon="add" @click="increase(index, product.quantity, product.stock)" />
                          </template>
                        </q-input>
                      </div>
                    </div>
                  </div>
                  <div class="col-2">
                    <div class="row justify-end q-mt-sm">
                      <q-btn round dense flat icon="delete" @click="remove(index)" class="q-ml-sm text-red" />
                    </div>
                  </div>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-separator inset />

        <q-card-section>
          <div class="flex justify-around text-h6">
            <span>Total: </span>
            <span>$ {{ cartStore.total }}</span>

            <!-- Send button -->
            <q-btn
              label="Save"
              icon="send"
              color="primary"
              @click="sendCart"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-btn-dropdown>
  </div>
</template>

<script>
import { useCartStore } from 'stores/cart'
import { Dialog, Notify } from 'quasar'

const cartStore = useCartStore()

export default {
  data () {
    return {
      cartStore: cartStore.getCurrentCart
    }
  },
  methods: {
    decrease ( index ) {
      cartStore.decreaseProductQuantity( index )
    },
    increase ( index, quantity, stock ) {
      if ( quantity >= stock ) return false
      cartStore.increaseProductQuantity( index )
    },
    remove (index) {
      cartStore.removeProduct( index )
    },
    deleteCart () {
      cartStore.resetCurrentCart()
    },
    confirmReset () {
      Dialog.create( {
        title: 'Confirm',
        message: 'Are you sure you want to empty the shopping cart?',
        cancel: true,
        persistent: true
      } ).onOk( () => {
        cartStore.resetCurrentCart()
      } )
    },
    sendCart () {
      // Make request
      cartStore.sendDataToApi()

      Notify.create( {
        message: 'Data was send successfully!',
        color: 'positive',
        icon: 'save',
        position: 'top'
      } )

      // Reset cart
      cartStore.resetCurrentCart()
    }
  }
}
</script>
