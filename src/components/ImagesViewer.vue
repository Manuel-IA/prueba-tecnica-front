<template>
  <div>
    <div class="text-subtitle2 text-grey-7">List photos</div>
    <q-card padding bordered>
      <q-list>
        <div
          v-for="(img, index) of imgs"
          :key="index"
          class="row"
        >
          <q-item
            clickable
            class="col-10"
            @click="showCarousel(index)"
          >
            <q-item-section>
              <q-item-label>
                <q-icon color="primary" size="20px" name="image"/>
                Imagen
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-btn
            class="col-2"
            flat
            color="primary"
            icon="delete"
            @click="removeImg(index)"
          />
        </div>
      </q-list>
    </q-card>

    <!-- Dialog -->
    <q-dialog
      v-model="medium"
    >
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">List photos</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="q-pa-md">
            <q-carousel
              swipeable
              animated
              v-model="slide"
              thumbnails
              infinite
            >
              <q-carousel-slide
                v-for="(img, index) of imgs"
                :name="img"
                :img-src="img"
                :key="index"
              />
            </q-carousel>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
export default {
  props: {
    images: { type: Array }
  },
  components: {
  },
  setup () {
    return {}
  },
  data () {
    const imgs = this.images

    return {
      imgs,
      medium: null,
      slide: 0
    }
  },
  methods: {
    showCarousel (index) {
      this.medium = true
      this.slide = index
    },
    removeImg (index) {
      this.imgs = this.imgs.filter((img, i) => index !== i)
    }
  }
}
</script>
