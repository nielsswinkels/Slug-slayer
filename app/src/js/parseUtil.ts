// Elise was here!

import parse from 'parse'
// import Store from 'src/store'
// import { Store } from 'src/store/index'
import { Session, Award, WonAward } from '../../../shared-types'

export async function signUp (email:string, username: string, password: string, termsAccepted: boolean) {
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
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
      console.error('Error: ' + (error as Parse.Error).code + ' ' + (error as Parse.Error).message);
      return { success: false, error: error as Parse.Error };
    } else {
      // Handle the case where the error is not the expected type
      console.error('An unexpected error occurred');
      return { success: false, error: new Error('An unexpected error occurred') };
    }
  }
}

export async function resetPassword (email: string) {
  try {
    await parse.User.requestPasswordReset(email)
    console.log('Password reset requested for user with email: ' + email)
    return { success: true }
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
      console.error('Error: ' + (error as Parse.Error).code + ' ' + (error as Parse.Error).message);
      return { success: false, error: error as Parse.Error };
    } else {
      // Handle the case where the error is not the expected type
      console.error('An unexpected error occurred');
      return { success: false, error: new Error('An unexpected error occurred') };
    }
  }
}

export async function logIn (email: string, password: string) {
  try {
    const user = await parse.User.logIn(email, password)
    console.log('User logged in successful with email: ' + user.get('email'))
    return { success: true }
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
      console.error('Error: ' + (error as Parse.Error).code + ' ' + (error as Parse.Error).message);
      return { success: false, error: error as Parse.Error };
    } else {
      // Handle the case where the error is not the expected type
      console.error('An unexpected error occurred');
      return { success: false, error: new Error('An unexpected error occurred') };
    }
  }
}

export async function logOut () {
  try {
    await parse.User.logOut()
    console.log('Logged out successful.')
    return { success: true }
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
      console.error('Error: ' + (error as Parse.Error).code + ' ' + (error as Parse.Error).message);
      return { success: false, error: error as Parse.Error };
    } else {
      // Handle the case where the error is not the expected type
      console.error('An unexpected error occurred');
      return { success: false, error: new Error('An unexpected error occurred') };
    }
  }
}

export async function saveKillCount (date: Date, count: number) {
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


export async function updateTotalKillCountForUser (userId: string, year: number) {
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
        const object = results[i];
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
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
      console.error('Error: ' + (error as Parse.Error).code + ' ' + (error as Parse.Error).message);
      return 0;
    } else {
      // Handle the case where the error is not the expected type
      console.error('An unexpected error occurred');
      return 0;
    }
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


export async function getTotalKillCountForUser (user: Parse.User): Promise<number> 
export async function getTotalKillCountForUser (user: Parse.User, year?: number): Promise<number>
export async function getTotalKillCountForUser (user: Parse.User, year?: number): Promise<number> {
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
  try {
    const queryTotal = new parse.Query('KillTotal')
    queryTotal.equalTo('userId', user.id)
    queryTotal.equalTo('year', year)
    const killTotal = await queryTotal.first()
    let total = 0
    if (killTotal) {
      total = killTotal.get('total')
    } else {
      total = await updateTotalKillCountForUser(user.id, year)
    }
    return total
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
      console.error('Error: ' + (error as Parse.Error).code + ' ' + (error as Parse.Error).message);
      return 0;
    } else {
      // Handle the case where the error is not the expected type
      console.error('An unexpected error occurred');
      return 0;
    }
  }
}

export async function getFirstKillForUserAndYear (user: Parse.User, year?: number): Promise<Session | undefined> {
  //const user = getUser(userId)
  if (!user) {
    console.error('No user found.')
    return undefined
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
  try {
    const query = new parse.Query('KillRecord')
    query.equalTo('user', user)
    query.greaterThanOrEqualTo('date', new Date(year + '-01-01'))
    query.lessThanOrEqualTo('date', new Date(year + '-12-31'))
    query.ascending('date')
    const result = await query.first()
    if (!result) {
      return undefined
    }
    return {
      id: result.id,
      user: result.get('user'),
      date: result.get('date'),
      createdAt: result.get('createdAt'),
      count: result.get('count'),
    } as Session;
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
      console.error('Error: ' + (error as Parse.Error).code + ' ' + (error as Parse.Error).message);
      return undefined;
    } else {
      // Handle the case where the error is not the expected type
      console.error('An unexpected error occurred');
      return undefined;
    }
  }
}

export async function getSessionsForUser (user: Parse.User) : Promise<Session[]> {
  if (!user) {
    console.error('No user found to getSessions.')
    return []
  }
  const query = new parse.Query('KillRecord')
  query.equalTo('user', user)
  query.include('user')
  query.limit(1000)
  query.descending('date')

  try {
    const results = await query.find();
    // Cast each result to the Session type
    return results.map((result) => {
      return {
        id: result.id,
        user: result.get('user'),
        date: result.get('date'),
        createdAt: result.get('createdAt'),
        count: result.get('count'),
      } as Session; // Cast to Session
    });
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
      console.error('Error: ' + (error as Parse.Error).code + ' ' + (error as Parse.Error).message);
      return [];
    } else {
      // Handle the case where the error is not the expected type
      console.error('An unexpected error occurred');
      return [];
    }
  }
}

export async function getAllUsers () : Promise<Parse.User[]> {
  const query = new parse.Query('_User')
  query.limit(1000)

  try {
    const results = await query.find();
    return results.map((result) => result as Parse.User);
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
      console.error('Error: ' + (error as Parse.Error).code + ' ' + (error as Parse.Error).message);
      return [];
    } else {
      // Handle the case where the error is not the expected type
      console.error('An unexpected error occurred');
      return [];
    }
  }
}

export async function getUser (userId: string) : Promise<Parse.User | null> {
  const query = new parse.Query(parse.User)
  query.equalTo('objectId', userId)

  try {
    const result = await query.first();
    if (!result) {
      return null
    }
    return result as Parse.User;
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
      console.error('Error: ' + (error as Parse.Error).code + ' ' + (error as Parse.Error).message);
      return null;
    } else {
      // Handle the case where the error is not the expected type
      console.error('An unexpected error occurred');
      return null;
    }
  }
}

export async function getAward (awardId: string) : Promise<Award | null> {
  const query = new parse.Query('Award')
  query.equalTo('objectId', awardId)

  try {
    const result = await query.first()
    if (!result) {
      return null
    }
    return result as Award
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
      console.error('Error: ' + (error as Parse.Error).code + ' ' + (error as Parse.Error).message);
      return null;
    } else {
      // Handle the case where the error is not the expected type
      console.error('An unexpected error occurred');
      return null;
    }
  }
}

export async function getAwardForUser (user:Parse.User, awardId:string, year:number) : Promise<WonAward | null> {
  const award = await getAward(awardId)
  if (!award || award == null) {
    console.warn('No award found with that id ', awardId)
    return null
  }
  console.log('getAwardForUser!', user, award, year)
  if (award instanceof parse.Object) {
    console.log('yes')
  } else {
    console.log('no')
  }
  const query = new parse.Query('WonAward')
  query.equalTo('user', user)
  // query.equalTo('award', award)
  query.equalTo('award', { '__type': 'Pointer', 'className': 'Award', 'objectId': award.id })
  query.equalTo('year', year)
  query.include('award')

  try {
    const result = await query.first();
    if (!result) {
      return null
    }
    return {
      id: result.id,
      user: result.get('user'),
      award: result.get('award'),
      year: result.get('year'),
      dateReceived: result.get('dateReceived')
    } as WonAward;
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
      console.error('Error: ' + (error as Parse.Error).code + ' ' + (error as Parse.Error).message);
      return null;
    } else {
      // Handle the case where the error is not the expected type
      console.error('An unexpected error occurred');
      return null;
    }
  }
}

export async function getAwardsForUser (user:Parse.User) : Promise<WonAward[]> {
  const query = new parse.Query('WonAward')
  query.equalTo('user', user)
  query.include('award')
  query.descending('dateReceived')

  try {
    const results = await query.find();
    return results.map((result) => {
      return {
        id: result.id,
        user: result.get('user'),
        award: result.get('award'),
        year: result.get('year'),
        dateReceived: result.get('dateReceived')
      } as WonAward;
    })
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
      console.error('Error: ' + (error as Parse.Error).code + ' ' + (error as Parse.Error).message);
      return [];
    } else {
      // Handle the case where the error is not the expected type
      console.error('An unexpected error occurred');
      return [];
    }
  }
}

export async function giveAwardToUser (user:Parse.User, awardId:string) : Promise<WonAward | null> {
  const award = await getAward(awardId)
  if (!award) {
    console.warn('No award found with that id ', awardId)
    return null
  }
  console.log('going to give award to user', award, user)
  const awardRecord = new parse.Object('WonAward')
  awardRecord.set('user', user)
  // awardRecord.set('award', award)
  awardRecord.set('award', { '__type': 'Pointer', 'className': 'Award', 'objectId': award.id })
  awardRecord.set('year', new Date().getFullYear())
  awardRecord.set('dateReceived', new Date())

  try {
    const savedAwardRecord = await awardRecord.save();
    // Re-fetch the object with the related Award included
    const query = new parse.Query('WonAward')
    query.include('award')
    const fullAwardRecord = await query.get(savedAwardRecord.id)

    return {
      id: fullAwardRecord.id,
      user: fullAwardRecord.get('user'),
      award: fullAwardRecord.get('award'),
      year: fullAwardRecord.get('year'),
      dateReceived: fullAwardRecord.get('dateReceived')
    } as WonAward;
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
      console.error('Error: ' + (error as Parse.Error).code + ' ' + (error as Parse.Error).message);
      return null;
    } else {
      // Handle the case where the error is not the expected type
      console.error('An unexpected error occurred');
      return null;
    }
  }
}

export default {
  signUp,
  resetPassword,
  logIn,
  logOut,
  saveKillCount,
  getTotalKillCountForUser,
  getFirstKillForUserAndYear,
  getSessionsForUser,
  getAllUsers,
  getUser,
  getAward,
  getAwardForUser,
  getAwardsForUser,
  giveAwardToUser
}
