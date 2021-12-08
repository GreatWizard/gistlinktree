import https from 'https'

const OPTIONS = {
  headers: {
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
    'User-Agent': 'actions/get-gist-action',
  },
}

const getGist = function (id) {
  return new Promise((resolve, reject) =>
    https
      .get(`https://api.github.com/gists/${id}`, OPTIONS, (resp) => {
        if (resp.statusCode !== 200) {
          reject(`Got an error: ${resp.statusCode}`)
        }

        let data = ''
        resp.on('data', (chunk) => {
          data += chunk
        })

        resp.on('end', async () => {
          console.log(`Gotten gist ${id} successfully from GitHub.`)
          resolve(JSON.parse(data))
        })
      })
      .on('error', (err) => {
        reject(`Error getting gist: ${err.message}`)
      }),
  )
}

export { getGist }
