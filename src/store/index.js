import { createStore } from 'vuex'

const { lat, lng } = JSON.parse(localStorage.getItem('BASE_POINT')) || {
  lat: 33.455480109285894,
  lng: 126.48997404583552
}

export default createStore({
  state: {
    gps: JSON.parse(localStorage.getItem('GPS_MAPPING')) || {},
    map: {
      base: { lat, lng },
      zoom: JSON.parse(localStorage.getItem('ZOOM_LEVEL')) || 11
    }
  },
  mutations: {
    mapZoom(state, payload) {
      state.map.zoom = payload
      localStorage.setItem('ZOOM_LEVEL', payload)
    },
    mapBase(state, payload) {
      state.map.base = { ...payload }
      localStorage.setItem('BASE_POINT', JSON.stringify(payload))
    }
  },
  actions: {
    mapZoom({ commit }, level) {
      commit('mapZoom', level)
    },
    mapBase({ commit }, point) {
      commit('mapBase', point)
    }
  },
  modules: {}
})
