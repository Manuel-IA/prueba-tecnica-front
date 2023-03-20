<template>
  <q-page class="flex flex-center">
    <h2 class="">Dummyjson</h2>

    <q-card class="full-width" >
      <div class="q-pa-md">
        <q-table
          title="Dummyjson"
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
          <!-- FILTERS -->
          <template v-slot:top-left="props">
            <div class="full-width q-pa-sm">
              Filters
            </div>

            <!-- Range -->
            <q-input class="q-px-sm" style="width: 20%" type="number" label="Min price" v-model="minOption" />
            <q-input class="q-px-sm" style="width: 20%" type="number" label="Max price" v-model="maxOption" />

            <!-- Order by -->
            <q-select
              class="q-px-sm"
              label="Order by"
              style="width: 25%;"
              v-model="filterOptions.orderBy"
              :options="filterOptions.options"
            />

            <!-- buttons -->
            <div class="full-width q-py-sm">
              <q-btn label="Apply" @click="applyFilters" />
              <q-btn label="Reset" @click="resetFilters" />
            </div>
          </template>

          <!-- Search Input -->
          <template v-slot:top-right>
            <q-input borderless dense debounce="300" v-model="filterOptions.wordToSearch" placeholder="Search">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>

          <!-- <template v-slot:top-right="props">
            records per page:
            <q-select
              borderless v-model="tablePagination.rowsPerPage"
              :options="tablePagination.rowsPerPageOptions"
            />

            on page: {{tablePagination.page}}

            <q-btn flat icon="chevron_left" @click="props.prevPage" />
            <q-btn flat icon="chevron_right" @click="props.nextPage" />
          </template> -->

          <template v-slot:item="props">
            <div v-if="true" :class="cardClasses" :style="props.selected ? 'transform: scale(0.90);' : ''" >
              <q-card style="min-height: 500px;" class="my-card">
                <q-img :src="props.row.thumbnail" style="max-height: 200px;" />

                <q-dialog v-model="showImage">
                  <q-card>
                    <q-card-section class="row items-center q-pb-none">
                      <div class="text-h6">Close Image</div>
                      <q-space />
                      <q-btn icon="close" flat round dense v-close-popup />
                    </q-card-section>

                    <q-card-section>
                      <q-img :src="props.row.thumbnail" />
                    </q-card-section>
                  </q-card>
                </q-dialog>

                <q-card-section>
                  <div class="row no-wrap items-center">
                    <div class="col text-h6">
                      {{props.row.title}}
                    </div>
                  </div>

                  <q-rating readonly v-model="props.row.rating" :max="5" size="16px" color="red" />
                </q-card-section>

                <q-card-section class="q-pt-none">
                  <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
                    {{props.row.brand}}
                  </div>

                  <div class="text-subtitle1">
                    ${{props.row.price}}・{{props.row.category}}
                  </div>

                  <div class="text-subtitle2">
                    Stock: {{props.row.stock}}
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
                  >
                    Show Details
                    {{props.row.id}}
                  </q-btn>
                </q-card-actions>
              </q-card>
            </div>
          </template>
        </q-table>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import { Loading } from 'quasar'
import { defineComponent } from 'vue'

export default {
  components: {
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
      url: 'https://dragon.virtualshop.c66.me/v1/products'
    }
  },
  data () {
    return {
      tablePagination: {
        rowsPerPage: 10,
        rowsPerPageOptions: [ 5, 10, 15, 20 ]
      },
      filterOptions: {
        options: [ 'A-Z', 'Z-A', '1-100', '100-1' ],
        orderBy: null,
        wordToSearch: null,
        majorToMinor: false,
        min: null,
        max: null
      },
      minOption: null,
      maxOption: null,
      rows: [],
      showImage: false
    }
  },
  mounted () {
    Loading.show()
    this.$axios.get( this.url )
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

      // console.log( wordToSearch )
      // console.log( min )
      // console.log( max )

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
          return product2.price - product1.price // Mayor a menor
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

      // Numeric
      if ( mode.includes( '1' ) ) {
        newArr.sort( ( product1, product2 ) => {
          let validation = ( mode == '1-100' ) ? (product1.price - product2.price) : (product2.price - product1.price)

          return( validation )
        } )
      }

      return( newArr )
    }
  }
}
</script>
