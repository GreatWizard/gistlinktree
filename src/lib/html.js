import DOMPurify from './dompurify.js'
import minify from './minify.js'

import { getIcon } from './icon.js'

const DEFAULT_AVATAR =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAACf1BMVEWbTcqcTcqbTMqbTcubTsqaTMucTcmcTcubTsucTMqaTcmbTsmbTcmaTcqaTMmaTcufVMytbNOxdNa2fNi8iNzBkN68iNusbNOfU8ynY9DVtOnkzvDz6fn//v/////Us+jAj96nYtDYuerx5/jXuOqeU8yvcdXUsuj48vv59fzbvuyeUsvDld/x5vjDk9+dUcvDlN/06/n27/rKoOO/jd317vr17fq+ityqZ9Lm0/KratOcT8vMpeT9/P79+/7LouOcTsqjXM7jzfDm0vGlXs+1fNi0etf+/f7Ck9/HmuHNpuXTsejSr+fSrufQrObJn+LIneKxddawc9WiWc7y6fjz6vmiWs7gx+7hyu/FmOCmYdD69/369vymYNDexO7cwey2ftnv4/fu4Pa9ity7htvr3PXs3fW5g9q4gNnm0vLl0PH+/v/MpOTKoePw5Pfv4vavcNStbtTiy++dUMv79/2aTMqyddbEluDTsujy6PikXc+pZdGoZdGub9Ssa9OhV83r2/Tcwu3bv+y9idyoY9HZu+ukXM+jW87gyO+8h9v59Pz48/vVtenavevYuuqqaNLGmuH8+f37+f3Ckt/dwu2gVs2gVcz28Pr38Pvt3vWlX8++i9zk0PGgV83RreekXs+hWM2zd9bexO369fz7+P2tbdTLo+Tp1/Pu4fby5/jw5ffn1PLWtumoZNHRreb27vrJn+PZvOv8+v6+jN3l0fHOqOW4gdq5gtr38fviy/DInuLizPDBkd7PqeW4gdmwctWpZtHt3/Wydtbfxu7n1fPp2PO3f9mzeNf07PmfVczPqua/jt3gye+6hduradLHnOHGmeHo1vO6hNq6g9rQq+Y+3j6uAAAIF0lEQVR4AezaNWLFMBCE4X+fxgz3P266lOFYsPOZSosZqyuCbF5AQUApwPtXAIiRTaLwiYImEKMR31PEMCZ+al7om/i9dZHoktj4IxuiOzt/LOiIANKmwMJ/KbTNxBMO0ttp0Es8KGhM7NjTCumtNEDkJuoK6jrJLLA2vLDnzQ5OWy4eJNGgw22OPWIhLfOoSCRmceYeFAX9WIX9MRX6IpLb0ifnpqaSs4Lw2p+yn2W80y99H2Tn1UZ5rTS74Dc0k9tKYmaR/BjHRkrmIYSZ+zT5SKO9tXcXzm0kWRjAn0q9EGbOfGYOmQJ2pAszk88UjpkxHK/CzLzMzMzMvPsHXcHxnSxqeiP9DCpW9XBP9/vafYbE/fzPYWSX4SNGjho9ZszYUSPHjY+3q8WEMRMnTXbwT87kSUnJKSQBg4Lk8aNT0/B/paWPzSC3y8zKRj9yckcJUsdruCQrb8pUhDR12nTzQyVK5M3IR1gKCoe7sQSiqBhhmzmL3Gb2JERkTomrXoOVzvUhQv6/zHNPkc/8BYjCwkVueQZaXICoFC8hV0j2IUpLl7lhJGi5g6g5K9iX3IqViMkqQbytRozWEGtrEbN1xFiRg5g5Y4it9T5I4N/A9dXQxk2QYvMWnmNhogyS/FWwLPxaDmnKOY4RVFRCmqpqhi+Nt0KibfymkG6HVIu5PQ+X7oBUO+cRL7sg2W5eV0GxB5LVCFZboBbS1REn9ZCugdMRMKER0jVWMNoCTVCgmfhogQKtxEYblGgnLgqhxDriYgGU6OBSXtbZBSWqOkmmbmW5Gz1QZCST+2AvFJlGPOyFIqtYXQMV6CAe9kGRqUwCqn1QxMejNzAcyuSx2AL7ocx84uAAlDmofh0cCQ5BmXaSqlvNqXAYypSQVF41GyAFylQQB1ugzBEWU+M6oUwnjwjGKiiSQzzUQJE+4uEBKBJgkja0Aoo0MamimAVFjpJkA9RMID8IRY5xqSfcBCXS2ISEHIcS6cRFEZSYxaZ85IQPCvhO8qmR7YACpxgVyu2CAqcZBcVknIF0Z/M4Fcqdg3RJxEmKD5L5jvFKCjgPyS6QCkLZ09DFRki19CIxkwupjrOrF99/BhKdPcEvL+0SJOolfkprIE1fKce4mPbLkOTKCKVn//2kyBRIcpVrbFAAUlxju2Tq9VZIsPMG30XMqycjZvkpnFdxn30TMcouIdbWVyImlSOJucxbiEH2ev4raB5IQ9Q2XXRDel71bUSp5g65QkYWopI7nNzi9BlErOqum/JmZzcgQg8eIG3uIQ1q8xGB4mTDyXkKPPRwF8JUueY6udHJFWcRhqqsR1ybOf1o8w6EsKPwCGnnJX0Or7mJoM6mPybI9Uozlz/+BP7Hkw+uGNVJ8WL6U6OfDjzz7OSzjY1nJz/7TODpsU/xbXxCYk09/u6jOOSlhIQElcOkCaJtbaDvueybz7/w4oyXKEIHp7z4wvM3s5/ry13bJoijl15+Bf+m9dWTFLb5/9lpKl7zkvIu4ADZzQ804r9cPj6CwvLUa6/jvzQGXiJO9k/04/9wGmZlUAgZb7yJ/8efdYJNrP5Db1UimLOpb+f10/p3jp9BMFUrrqts8GCSRCx7F/2qfG/dhgz6H9dHvv9BF/p160Nh/3Kis+sRBt/tBz4a8/EnBys2bqw4+MnHH65eMBnhePNTy5+MO5d3QakrK6bbfBU41AflPvuEbCWW+6CBb8U8O98Nn/wAmjy4X0ljB1FMNmyCNvmfU0y6GRz+Ck4DlcZ/Ac0ezyCLbPkS2n01n6zxUgsMSJtNlvikAEa8kklW+LgLhlR+bcOzwPbLMMb/Nhk36jIMer3OdIfgsS4Y9eQSitAAkqmnEoZ1fWOyV7yhCsblZJqbDnPnW1jglQpTN4Ibt2GFmu/IiHmnYIkv5hlZdPFlWON7E0PiY2CRH0i7w1dgkctPkWZ5n8Eqz47XPAY+EZZZqXcq1NcOLOO8rXM06MQrsM7NRzSeAO/BQj+SPKL/s2U0rPSTrjNg+GRYKf870uNlWOp7PX2ii6/DUv6fJd4Bg18034S1HiQNXvLDWq9PIA1+8sFSS0freTWS7MBKzrJgLfHYEBGk3vukzVuw0FydM6cKYZ0mvdNm1jmwivMLBSPU1Bf3NsIizq+kiMdLQST7YA1/ERmwOAeWqPqajBi3GVb4tt1UOU11DSzQt4iMyTgO4wLDSTUPBTfDD6N8hRSUx0OSiMEU1GPFMOjmEgpqkKZ1SBYtgDHv7deWkDKAghIznoQRl5cLjetm3E/BldTAgJ1PUXADhNaSkryPfNDs9RXTJbRf3gSy2Quh1W8l1A/h0b8ik0jOhjY5y+eRfRYdb4QWS1MfITuVvAcNGtqVz4KJ/uHqnVYo9mwdmSWoX/Nqa5Q2P7nU+sCVebV7oMjO0M0XZAHx+5uQz2n4QyjIB1TkYlYXpLqcO0LnFBgJ37Rl3WeQ5vYvG23LBfKGlZz3CiTITs9kGwPTWZf+CmJSnP51KbE2b+SfrYjSs39uEGSchC73I6PTWxGh53JnTCDLeSgCFXdXN5xFWLIbHr5bYWEoqoQ777HdzRfm5DsIwsmvv9C8+5iC3WCXjJJvdvfOTQo8Xvbgg319Dz5Y9nggqal39zclGZTAMhJwKMf285doflwb4InnaNbBFj8ZCVJvEFltGMW9QXGffyxUbQNBjAykeOchaQQxJSSs43X/fSSIt27B4I6v3EAR+YQMQW7T7aUweLvJ9QaQh4i8XiL6x6eHBsRlH8fjIaMS/gbul8nL2B6OKQAAAABJRU5ErkJggg=='

const decorateHTML = function (content, options) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${
      options.title
        ? options.mainTitle
          ? `${options.title} | ${options.mainTitle}`
          : options.title
        : options.mainTitle
          ? options.mainTitle
          : 'Home'
    }</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,300italic,700,700italic">
    <link rel="stylesheet" href="/${options.mainStyleSheet}">
    ${
      options.fontAwesome
        ? `<script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/js/all.min.js" integrity="sha512-Tn2m0TIpgVyTzzvmxLNuqbSJH3JP8jm+Cy3hvHrW7ndTDcJ1w5mBiksqDBb8GpE2ksktFvDB/ykZ0mDpsZj20w==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" integrity="sha512-1ycn6IcaQQ40/MKBW2W4Rhis/DbILU74C1vSrLJxCq57o941Ym01SwNsOMqvEBFlcgUa6xLiPY/NS5R+E6ztJQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />`
        : ''
    }
    ${(options.styleSheets || []).map((s) => `<link rel="stylesheet" href="./${s}">`)}
    ${options.favicon ? '<link rel="icon" type="image/x-icon" href="./favicon.ico">' : ''}
  </head>
  <body><main class="wrapper">${DOMPurify.sanitize(content)}</main></body>
  </html>`
}

const generateIndex = async function (index = [], linksSocial = [], options = {}) {
  const linksSocialHTML = `<section class="container center socials">
    ${linksSocial
      .map(
        (i) =>
          `<a href="${i.url}" target="_blank" rel="noopener noreferrer"><i class="${getIcon(i.type)} fa-2x"></i></a>`,
      )
      .join('')}
    </section>`

  return await minify(
    decorateHTML(
      `<header class="container center header">
        <img src="${
          options.avatar
            ? options.avatar
            : options.gravatar
              ? `https://gravatar.com/avatar/${options.gravatar}?s=200`
              : DEFAULT_AVATAR
        }" alt="Avatar" class="img avatar">
        ${options.mainTitle ? `<h1 class="title">${options.mainTitle}</h1>` : ''}
      </header>
      ${options.linksSocialPosition === 'top' ? linksSocialHTML : ''}
      <section class="container center links">
        ${index
          .map(
            (i) =>
              `<a class="button button--link" href="${i.url}" target="_blank" rel="noopener noreferrer"><p class="button__text">${i.title}</p></a>`,
          )
          .join('')}
      </section>
      ${options.linksSocialPosition !== 'top' ? linksSocialHTML : ''}`,
      {
        title: `Home`,
        fontAwesome: true,
        ...options,
      },
    ),
  )
}

export { decorateHTML, generateIndex }
