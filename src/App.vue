<script setup>
import { onBeforeMount, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import usePlaces from '@/compositions/usePlaces'

const { kakao } = window
let map = null

const store = useStore()
const mapContainer = ref(null)
const { point } = usePlaces(store.state.gps)

onBeforeMount(() => {
  console.log('onBeforeMount', point, point.value)
})

onMounted(() => {
  const { lat, lng } = store.state.map.base
  const level = store.state.map.zoom

  map = new kakao.maps.Map(mapContainer.value, {
    center: new kakao.maps.LatLng(lat, lng),
    level
  })

  registerMapEvents()

  console.log('onMounted', point, point.value)
})

function registerMapEvents() {
  kakao.maps.event.addListener(map, 'zoom_changed', function () {
    store.dispatch('mapZoom', map.getLevel())
  })

  kakao.maps.event.addListener(map, 'center_changed', function () {
    const center = map.getCenter()

    store.dispatch('mapBase', {
      lat: center.getLat(),
      lng: center.getLng()
    })
  })
}
</script>
<template>
  <div ref="mapContainer" class="map"></div>
</template>
