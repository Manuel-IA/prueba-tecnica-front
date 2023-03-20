<template>
  <q-card
    class="full-width"
    :style="getCardStyles"
  >
    <q-card-section class="row items-center q-pb-none">
      <q-space />
      <q-btn id="closeDialogBtn" icon="close" flat round dense v-close-popup />
    </q-card-section>

    <div class="q-pa-md">
      <q-img :src="product.thumbnail"/>
    </div>

    <q-card-section>
      <div class="row no-wrap items-center">
        <div class="col text-h6">
          {{product.title}}
        </div>
      </div>

      <q-rating readonly v-model="product.rating" :max="5" size="16px" color="red" />
      <span class="text-caption text-grey q-px-sm">({{product.rating}})</span>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
        {{product.brand}}
      </div>

      <div class="text-subtitle1">
        ${{product.price}}・{{product.category}}
      </div>

      <div class="text-subtitle2  q-pb-md">
        Stock: <q-badge :color="(product.stock > 0) ? 'green' : 'red'" color="green">{{product.stock}}</q-badge>
      </div>
      <q-separator />

      <div class="text-caption text-grey q-py-sm">
        <p class="text-center" >
          Description
        </p>
        <span>
          {{product.description}}
        </span>
      </div>
    </q-card-section>

    <!-- Add and remove products -->
    <q-card-section v-if="hasStock" >
      <q-separator class="q-mb-md" />
      <div class="row no-wrap items-center">
        <span class="text-h6 q-pr-md" >TOTAL: ${{getTotalPrice}} </span>
      </div>

      <div class="text-right" >
        <q-btn
          @click="decrease"
          label="-"
          :disable="disableDecreaseBtn"
        />
          {{counter}}
        <q-btn
          label="+"
          @click="increase"
        />

        <q-btn
          class="q-ml-sm"
          icon="shopping_cart"
          label="Add"
          @click="onAddProductToCart"
          :disable="disableDecreaseBtn"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { Notify } from 'quasar'

export default {
  props: {
    productInfo: {
      type: Object
    }
  },
  data () {
    return {
      product: this.productInfo,
      counter: 0
    }
  },
  computed: {
    getCardStyles () {
      return {
        maxWidth: '600px'
      }
    },
    hasStock () {
      return this.product.stock > 0
    },
    getTotalPrice () {
      return this.product.price * this.counter
    },
    isThereStock () {
      return this.counter < this.product.stock
    },
    disableDecreaseBtn () {
      return this.counter === 0
    }
  },
  methods: {
    increase () {
      if ( this.isThereStock ) {
        this.counter++
      } else {
        Notify.create( {
          message: 'Quantity cannot be greater than stock!',
          color: 'negative',
          position: 'top',
          icon: 'error'
        } )
      }
    },
    decrease () {
      this.counter--
    },
    onAddProductToCart () {
      document.getElementById( 'closeDialogBtn' ).click()

      // Message
      Notify.create( {
        message: 'Product added successfully',
        color: 'positive',
        position: 'top',
        icon: 'check_circle'
      } )
    }
  }
}
</script>
