import api from './api'

const PORT = process.env.PORT || 8001

api.listen(PORT, () => {
  console.log(`listening on ${PORT}...`)
})
