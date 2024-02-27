// Elise was here!

import parse from 'parse'
// import Store from 'src/store'
// import { Store } from 'src/store/index'

export async function signUp (email, password, termsAccepted) {
  // Create a new instance of the user class
  const user = new parse.User()
  user.set('username', email)
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

export default {
  signUp,
  resetPassword,
  logIn,
  logOut
}
