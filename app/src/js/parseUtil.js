// Elise was here!

import parse from 'parse'
// import Store from 'src/store'
// import { Store } from 'src/store/index'

export async function signUp (email, username, password, termsAccepted) {
  // Create a new instance of the user class
  const user = new parse.User()
  user.set('username', username)
  user.set('password', password)
  user.set('email', email)
  user.set('termsAccepted', termsAccepted)

  try {
    const createdUser = await user.signUp()
    console.log('User created successful with name: ' + createdUser.get('username') + ' and email: ' + createdUser.get('email'))
    return { success: true }
  } catch (error) {
    console.log('Error: ' + error.code + ' ' + error.message)
    return { success: false, error: error }
  }
}

export async function resetPassword (email) {
  try {
    await parse.User.requestPasswordReset(email)
    console.log('Password reset requested for user with email: ' + email)
    return { success: true }
  } catch (error) {
    console.log('Error: ' + error.code + ' ' + error.message)
    return { success: false, error: error }
  }
}

export async function logIn (email, password) {
  try {
    const user = await parse.User.logIn(email, password)
    console.log('User logged in successful with email: ' + user.get('email'))
    return { success: true }
  } catch (error) {
    console.log('Error: ' + error.code + ' ' + error.message)
    return { success: false, error: error }
  }
}

export async function logOut () {
  try {
    await parse.User.logOut()
    console.log('Logged out successful.')
    return { success: true }
  } catch (error) {
    console.log('Error: ' + error.code + ' ' + error.message)
    return { success: false, error: error }
  }
}

export async function saveKillCount (date, count) {
  const killRecord = new parse.Object('KillRecord')
  const currentUser = parse.User.current()
  if (!currentUser) {
    console.error('No user found to save KillRecord.')
    return null  
  }
  killRecord.set('date', date)
  killRecord.set('count', count)
  killRecord.set('user', currentUser)

  try {
    const savedKillRecord = await killRecord.save()
    console.log('KillRecord has been saved.', savedKillRecord)
    await updateTotalKillCountForUser(currentUser.id, date.getFullYear())
    return savedKillRecord
  } catch (error) {
    console.error('Error while saving KillRecord: ', error)
    return null
  }
}


export async function updateTotalKillCountForUser (userId, year) {
  console.log('updating total killcount for ', userId, year)
  const query = new parse.Query('KillRecord')
  
  const user = await getUser(userId)
  if (!user) {
    console.error('No user found to update KillTotal.')
    return 0
  }
  if (!year) {
    const d = new Date()
    year = d.getFullYear()
  }
  if (year < 50) {
    year += 2000
  }
  if (year < 100) {
    year += 1900
  }

  query.equalTo('user', user)
  query.lessThan('date', new Date((year+1)+'-01-01'))
  query.greaterThanOrEqualTo('date', new Date(year+'-01-01'))
  query.limit(1000)

  try {
    const results = await query.find()
    let sum = 0;
    for (let i = 0; i < results.length; i++) {
        let object = results[i];
        sum += object.get('count');
    }

    const queryTotal = new parse.Query('KillTotal')
    queryTotal.equalTo('userId', userId)
    queryTotal.equalTo('year', year)
    let killTotal = await queryTotal.first()
    if (!killTotal) {
      killTotal = new parse.Object('KillTotal')
      killTotal.set('year', year)
      killTotal.set('userId', userId)
    }
    killTotal.set('total', sum)
    const savedKillTotal = await killTotal.save()
    console.log('KillTotal has been updated.', savedKillTotal)
    return sum
  } catch (error) {
    console.error(`Failed to retrieve the object, with error code: ${error.message}`)
    return 0
  }
}

// export async function updateTotalKillCountForUser (user, year) {
//   console.log('updating total killcount for ', user, year)
//   const query = new parse.Query('KillRecord')
//   if (!year) {
//     const d = new Date()
//     year = d.getFullYear()
//   }
//   if (year < 50) {
//     year += 2000
//   }
//   if (year < 100) {
//     year += 1900
//   }
//   query.equalTo('user', user)
//   query.lessThan('date', new Date((year+1)+'-01-01'))
//   query.greaterThanOrEqualTo('date', new Date(year+'-01-01'))
//   query.limit(1000)

//   try {
//     const results = await query.find()
//     let sum = 0;
//     for (let i = 0; i < results.length; i++) {
//         let object = results[i];
//         sum += object.get('count');
//     }
//     let totalKillsPerYear = user.get('totalKillsPerYear')
//     totalKillsPerYear[year] = sum
//     user.set('totalKillsPerYear', totalKillsPerYear)
//     user.save()
//     return sum
//   } catch (error) {
//     console.error(`Failed to retrieve the object, with error code: ${error.message}`)
//     return 0
//   }
// }

export async function getTotalKillCountForUser (user, year) {
  //const user = getUser(userId)
  if (!user) {
    console.error('No user found to save KillTotal.')
    return 0
  }
  if (!year) {
    const d = new Date()
    year = d.getFullYear()
  }
  if (year < 50) {
    year += 2000
  }
  if (year < 100) {
    year += 1900
  }
  const queryTotal = new parse.Query('KillTotal')
  queryTotal.equalTo('userId', user.id)
  queryTotal.equalTo('year', year)
  const killTotal = await queryTotal.first()
  let total = 0
  if (killTotal) {
    total = killTotal.get('total')
  } else {
    total = updateTotalKillCountForUser(user.id, year)
  }
  return total
}

export async function getAllUsers () {
  const query = new parse.Query('User')
  query.limit(1000)

  try {
    return await query.find()
  } catch (error) {
    console.error(`Failed to retrieve the object, with error code: ${error.message}`)
    return []
  }
}

export async function getUser (userId) {
  const query = new parse.Query(parse.User)
  query.equalTo('objectId', userId)

  try {
    return await query.first()
  } catch (error) {
    console.error(`Failed to retrieve the object, with error code: ${error.message}`)
    return []
  }
}

export default {
  signUp,
  resetPassword,
  logIn,
  logOut,
  saveKillCount,
  getTotalKillCountForUser,
  getAllUsers
}
