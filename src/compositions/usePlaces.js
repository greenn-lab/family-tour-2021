import { computed, ref } from 'vue'

/*
async function markAddress(places) {
  Promise.all(
    places
      .filter(({ address }) => !store.state.gps.hasOwnProperty(address))
      .map(({ type, name, address }) =>
        fetch(
          `https://dapi.kakao.com/v2/local/search/address.json?analyze_type=exact&query=${address}`,
          {
            headers: {
              Authorization: `KakaoAK ${process.env.VUE_APP_KAKAO_REST}`
            }
          }
        )
          .then((res) => res.json())
          .then(({ documents: [{ x: lng, y: lat }] }) => {
            store.state.gps[address] = [lat, lng, name, type]
            localStorage.setItem('GPS_MAPPING', JSON.stringify(GPS_MAPPING))
          })
      )
  ).then(() => {
    console.log('all')
    Object.keys(GPS_MAPPING).forEach((address) => {
      const [lat, lng, name, type] = GPS_MAPPING[address]

      new kakao.maps.CustomOverlay({
        position: new kakao.maps.LatLng(lat, lng),
        content: TPL_POST(type, name)
      }).setMap(map)
    })
  })
}
*/

export default function usePlaces(gps) {
  const places = ref({})

  async function fetchPlaces() {
    const extractCell = (name, address) => ({
      name: name?.effectiveValue?.stringValue.trim(),
      address: address?.effectiveValue?.stringValue.trim()
    })

    const collect = (_places, type, place) => {
      place?.address && places.value.push({ type, ...place })
    }

    places.value = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/1xC7eRNqiSLHLz6vY3qNd9tRBJ9dkh7fQs3DqXpqbZFw?&key=${process.env.VUE_APP_GOOGLE_SHEETS}&includeGridData=true&ranges=B6:G42`
    )
      .then((res) => res.json())
      .then(
        ({
          sheets: [
            {
              data: [{ rowData }]
            }
          ]
        }) => {
          const _places = []

          rowData.forEach(
            ({
              values: [name0, address0, name1, address1, name2, address2]
            }) => {
              collect(_places, 'play', extractCell(name0, address0))
              collect(_places, 'food', extractCell(name1, address1))
              collect(_places, 'home', extractCell(name2, address2))
            }
          )

          const map = {}

          places
            .filter(({ address }) => !gps[address])
            .forEach(
              ({ type, name, address }) => (map[address] = { type, name })
            )

          return map
        }
      )
  }

  fetchPlaces(gps)

  return {
    point: computed(() => places.value)
  }
}
