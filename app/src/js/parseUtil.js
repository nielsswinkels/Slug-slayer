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
    return savedKillRecord
  } catch (error) {
    console.error('Error while saving KillRecord: ', error)
    return null
  }
}

export async function getTotalKillCountForUser (user) {
  const query = new parse.Query('KillRecord')
  query.equalTo('user', user)
  query.limit(1000)

  try {
    const results = await query.find()
    let sum = 0;
    for (let i = 0; i < results.length; i++) {
        let object = results[i];
        sum += object.get('count');
    }
    return sum
  } catch (error) {
    console.error(`Failed to retrieve the object, with error code: ${error.message}`)
    return 0
  }
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

export default {
  signUp,
  resetPassword,
  logIn,
  logOut,
  saveKillCount,
  getTotalKillCountForUser,
  getAllUsers
}
