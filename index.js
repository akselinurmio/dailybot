const fs = require('fs')
const filename = process.argv[2]

const schedule = require('node-schedule')

const IncomingWebhook = require('@slack/client').IncomingWebhook
const url = process.env.SLACK_WEBHOOK_URL
const webhook = new IncomingWebhook(url)

function sendMessage(message) {
  return new Promise(function (resolve, reject) {
    return webhook.send(message, function (err, res) {
      if (err) return reject(err)
      console.log('Message sent: ', res)
      return resolve(res)
    })
  })
}

function getLines(file) {
  return new Promise(function (resolve, reject) {
    return fs.readFile(file, 'utf8', function (err, data) {
      if (err) return reject(err)

      try {
        const array = data.split("\n")
          .filter(s => s !== '')
          .filter(s => !(/^\/\//.test(s)))
          .map(s => s.replace(/^- /, ''))
        return resolve(array)
      } catch (err) {
        return reject(err)
      }
    })
  })
}

function saveLines(file, array) {
  return new Promise(function (resolve, reject) {
    let data

    try {
      data = array.join("\n") + "\n"
    } catch (err) {
      return reject(err)
    }

    return fs.writeFile(file, data, 'utf8', function (err) {
      if (err) return reject(err)
      console.log('Saved data to ' + file)
      return resolve(data)
    })
  })
}

function getRandomFromArray(array) {
  return new Promise(function (resolve, reject) {
    try {
      const index = Math.floor(Math.random()*array.length)
      return resolve(array[index], index)
    } catch (err) {
      return reject(err)
    }
  })
}

function removeItemFromArray(array, index) {
  return new Promise(function (resolve, reject) {
    try {
      array.splice(index, 1)
      return resolve(array)
    } catch (err) {
      return reject(err)
    }
  })
}

function compose(seed) {
  return new Promise(function(resolve, reject) {
    try {
      const wrapper = 'Here it is. Today\'s most awaited moment. The daily UI challenge: %%.'
      return resolve(wrapper.replace(/%%/, '*'+seed+'*'))
    } catch (err) {
      return reject(err)
    }

    // const ordinary = [
    //   'Welcome to the Hydraulic UI challenge, for today\'s extra content we have %%.',
    //   '_... saxophone playing ..._ here today, and only today, we present you: %%!',
    //   'Today\'s playground is %%.',
    //   ''
    // ]
    // const weekend = [
    //   'Here\'s some action for your lame ass weekend, build a/an %%!',
    //   'Please enjoy your weekend, mah bro, with this daily Divi UI challenge: %%.'
    // ]
    //
    // let wrapper
    //
    // try {
    //   // Pick case based on weekday
    //   switch (new Date().getDay()) {
    //     case 5:
    //     case 6:
    //     case 0:
    //       wrapper = getRandomFromArray(weekend)
    //       break;
    //     default:
    //       wrapper = getRandomFromArray(ordinary)
    //   }
    // } catch (err) {
    //   return reject(err)
    // }
  })
}

function setSchedule(cronTime) {
  return schedule.scheduleJob(cronTime, function () {
    return getLines(filename)
      .then(getRandomFromArray)
      .then(compose)
      .then(sendMessage)
      .catch(console.error)
  })
}

setSchedule('0 0 0 * * *')
