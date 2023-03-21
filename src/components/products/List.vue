<template>
  <q-card class="full-width" >
    <div class="q-px-md q-pb-md q-pt-sm">
      <q-table
        title="Products"
        :rows="rows"
        :columns="columns"
        v-model:pagination="tablePagination"
        :rows-per-page-options="tablePagination.rowsPerPageOptions"
        virtual-scroll
        row-key="name"
        grid
        :filter="filterOptions"
        :filter-method="myFilterMethod"
      >

        <!-- Search Input -->
        <template v-slot:top-left="props">
          <q-input borderless dense debounce="300" v-model="filterOptions.wordToSearch" placeholder="Search" class="q-mt-sm q-mb-md">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <!-- FILTERS -->
        <template v-slot:top-right="props">
          <div class="flex justify-end">
            <div class="row">
              <!-- Range -->
              <q-input class="q-px-sm" style="width: 30%" type="number" label="Min price" v-model="minOption" />
              <q-input class="q-px-sm" style="width: 30%" type="number" label="Max price" v-model="maxOption" />

              <!-- Order by -->
              <q-select
                class="q-px-sm"
                style="width: 35%;"
                label="Order by"
                v-model="filterOptions.orderBy"
                :options="filterOptions.options"
              />
            </div>

            <!-- buttons -->
            <div class="full-width q-py-sm text-right">
              <q-btn label="Apply" @click="applyFilters" />
              <q-btn label="Reset" @click="resetFilters" />
            </div>
          </div>
        </template>

        <template v-slot:item="props">
          <div v-if="true" :class="cardClasses" :style="props.selected ? 'transform: scale(0.90);' : ''" >
            <q-card style="min-height: 500px;" class="my-card">
              <q-img :src="props.row.thumbnail" style="max-height: 200px;" />

              <q-card-section>
                <div class="row no-wrap items-center">
                  <div class="col text-h6">
                    {{props.row.title}}
                  </div>
                </div>

                <q-rating readonly v-model="props.row.rating" :max="5" size="16px" color="red" />
                <span class="text-caption text-grey q-px-sm">({{props.row.rating}})</span>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
                  {{props.row.brand}}
                </div>

                <div class="text-subtitle1">
                  ${{props.row.price}}・{{props.row.category}}
                </div>

                <div class="text-subtitle2 q-pb-md">
                  Stock: <q-badge class="q-px-sm" :color="(props.row.stock > 0) ? 'green' : 'red'">{{props.row.stock}}</q-badge>
                </div>
                <q-separator />

                <div class="text-caption text-grey q-py-sm">
                  <span class="ellipsis-3-lines" >
                    {{props.row.description}}
                  </span>
                </div>
              </q-card-section>

              <q-card-actions>
                <q-btn
                  flat
                  class="q-mx-auto"
                  color="primary"
                  icon="zoom_in"
                  @click="onShow( props.row )"
                >
                  Show Details
                </q-btn>
              </q-card-actions>
            </q-card>
          </div>
        </template>
      </q-table>

      <!-- Dialog -->
      <q-dialog v-model="showInfo">
        <ShowProduct :productInfo="productToShow"/>
      </q-dialog>
    </div>
  </q-card>
</template>

<script>
import { Loading } from 'quasar'
import { defineComponent } from 'vue'
import ShowProduct from 'src/components/products/ShowProduct.vue'
import { useCartStore } from 'src/stores/cart.js'

const cartStore = useCartStore()

export default {
  components: {
    ShowProduct
  },
  setup () {
    const columns = [
      { name: 'brand', label: 'brand', field: 'brand' },
      { name: 'category', label: 'category', field: 'category' },
      { name: 'description', label: 'description', field: 'description' },
      { name: 'discountPercentage', label: 'discountPercentage', field: 'discountPercentage' },
      { name: 'id', label: 'id', field: 'id' },
      { name: 'price', label: 'price', field: 'price' },
      { name: 'rating', label: 'rating', field: 'rating' },
      { name: 'stock', label: 'stock', field: 'stock' },
      { name: 'title', label: 'title', field: 'title' },
      { name: 'images', label: 'images', field: 'images' },
      { name: 'thumbnail', label: 'thumbnail', field: 'thumbnail' }
    ]

    return {
      columns,
      url: '/products'
    }
  },
  data () {
    const tablePagination = {
      rowsPerPage: 20,
      rowsPerPageOptions: [ 5, 10, 15, 20 ]
    }
    const filterOptions = {
      options: [ 'A-Z', 'Z-A', '1-100', '100-1' ],
      orderBy: 'A-Z',
      wordToSearch: null,
      majorToMinor: false,
      min: null,
      max: null
    }

    return {
      tablePagination,
      filterOptions,
      minOption: null,
      maxOption: null,
      rows: [],
      showInfo: false,
      productToShow: {}

    }
  },
  mounted () {
    Loading.show()
    this.$api.get( this.url )
      .then( ( response ) => {
        let products = response.data

        // Sort array
        products = this.sortBy( products, 'a-z' )

        // Assign sorted array
        this.rows = products

        // Disable loading
        Loading.hide()
      } )
  },
  computed: {
    cellStyles () {
      return 'col-xs-4 col-sm-5 col-md-3 q-ma-none q-py-md'
    },
    cardClasses () {
      return 'q-pa-md col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition'
    }
  },
  methods: {
    applyFilters () {
      this.filterOptions.min = this.minOption
      this.filterOptions.max = this.maxOption
      this.filterOptions.majorToMinor = false
    },
    resetFilters () {
      this.filterOptions.majorToMinor = true
      this.filterOptions.wordToSearch = null
      this.filterOptions.orderBy = null
      this.filterOptions.min = null
      this.filterOptions.max = null
      this.minOption = null
      this.maxOption = null
    },
    myFilterMethod ( rows, terms, cols ) {
      // Search option
      const wordToSearch = this.filterOptions.wordToSearch

      // Order option
      const orderBy = this.filterOptions.orderBy

      // Range
      const min = parseFloat( this.filterOptions.min )
      const max = parseFloat( this.filterOptions.max )

      let newArr = [].concat(rows) // Copy original array

      // Range Filter
      if ( min && max ) {
        newArr = rows.filter( ( element ) => (element.price >= min) && (element.price <= max) )
      }

      // Search input
      if ( wordToSearch ) {
        const search = wordToSearch.toLowerCase()

        newArr = newArr.filter( ( product ) => {
          return product.title.toLowerCase().includes( search )
        } )
      }

      // Sort by
      if ( orderBy ) {
        const sortBy = orderBy.toLowerCase()
        newArr = this.sortBy( newArr, sortBy )
      }

      // Reset button
      if ( this.filterOptions.majorToMinor ) {
        newArr = newArr.sort( ( product1, product2 ) => {
          return product2.price - product1.price
        } )
      }

      return newArr
    },
    sortBy ( arr, mode ) {
      let newArr = [].concat( arr ) // Copy original array

      // ABC
      if ( mode.includes( 'a' ) ) {
        newArr.sort( (a, b) => {
          let validation1 = ( mode == 'a-z' ) ? (a.title.toLowerCase() > b.title.toLowerCase()) : (a.title.toLowerCase() < b.title.toLowerCase())
          let validation2 = ( mode == 'a-z' ) ? (a.title.toLowerCase() < b.title.toLowerCase()) : (a.title.toLowerCase() > b.title.toLowerCase())

          if ( validation1 ) {
            return 1;
          }
          if ( validation2 ) {
            return -1;
          }
          return 0;
        } )
      }

      // Numbers
      if ( mode.includes( '1' ) ) {
        newArr.sort( ( product1, product2 ) => {
          let validation = ( mode == '1-100' ) ? (product1.price - product2.price) : (product2.price - product1.price)

          return( validation )
        } )
      }

      return( newArr )
    },
    onShow ( productInfo ) {
      this.productToShow = {...productInfo}
      const currentStock = cartStore.getCurrentStock(productInfo.id, productInfo.is_fake_store_api )
      if ( currentStock !== -1 ) {
        this.productToShow.stock = currentStock
      }
      this.showInfo = true
    }
  }
}
</script>
