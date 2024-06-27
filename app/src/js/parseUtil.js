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
    if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
      console.error('Error: ' + error.code + ' ' + error.message);
      return { success: false, error };
    } else {
      // Handle the case where the error is not the expected type
      console.error('An unexpected error occurred');
      return { success: false, error: new Error('An unexpected error occurred') };
    }
  }
}

export async function resetPassword (email) {
  try {
    await parse.User.requestPasswordReset(email)
    console.log('Password reset requested for user with email: ' + email)
    return { success: true }
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
      console.error('Error: ' + error.code + ' ' + error.message);
      return { success: false, error };
    } else {
      // Handle the case where the error is not the expected type
      console.error('An unexpected error occurred');
      return { success: false, error: new Error('An unexpected error occurred') };
    }
  }
}

export async function logIn (email, password) {
  try {
    const user = await parse.User.logIn(email, password)
    console.log('User logged in successful with email: ' + user.get('email'))
    return { success: true }
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
      console.error('Error: ' + error.code + ' ' + error.message);
      return { success: false, error };
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
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
      console.error('Error: ' + error.code + ' ' + error.message);
      return { success: false, error };
    } else {
      // Handle the case where the error is not the expected type
      console.error('An unexpected error occurred');
      return { success: false, error: new Error('An unexpected error occurred') };
    }
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
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
      console.error('Error: ' + error.code + ' ' + error.message);
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


export async function getTotalKillCountForUser (user) {
  const d = new Date()
  let year = d.getFullYear()
  return getTotalKillCountForUserAndYear (user, year)
}

export async function getTotalKillCountForUserAndYear (user, year) {
  if (!user) {
    console.error('No user found to get KillTotal.')
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
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
      console.error('Error: ' + error.code + ' ' + error.message);
      return 0;
    } else {
      // Handle the case where the error is not the expected type
      console.error('An unexpected error occurred');
      return 0;
    }
  }
}


export async function getFirstKillForUserAndYear (user, year) {
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
    };
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
      console.error('Error: ' + error.code + ' ' + error.message);
      return undefined;
    } else {
      // Handle the case where the error is not the expected type
      console.error('An unexpected error occurred');
      return undefined;
    }
  }
}

export async function getSessionsForUser (user) {
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
    return results.map((result) => {
      return {
        id: result.id,
        user: result.get('user'),
        date: result.get('date'),
        createdAt: result.get('createdAt'),
        count: result.get('count'),
      };
    });
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
      console.error('Error: ' + error.code + ' ' + error.message);
      return [];
    } else {
      // Handle the case where the error is not the expected type
      console.error('An unexpected error occurred');
      return [];
    }
  }
}

export async function getAllUsers () {
  const query = new parse.Query('_User')
  query.limit(1000)

  try {
    return await query.find();
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
      console.error('Error: ' + error.code + ' ' + error.message);
      return [];
    } else {
      // Handle the case where the error is not the expected type
      console.error('An unexpected error occurred');
      return [];
    }
  }
}

export async function getUser (userId) {
  const query = new parse.Query(parse.User)
  query.equalTo('objectId', userId)

  try {
    const result = await query.first();
    if (!result) {
      return null
    }
    return result;
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
      console.error('Error: ' + error.code + ' ' + error.message);
      return null;
    } else {
      // Handle the case where the error is not the expected type
      console.error('An unexpected error occurred');
      return null;
    }
  }
}

export async function getAward (awardId) {
  const query = new parse.Query('Award')
  query.equalTo('objectId', awardId)

  try {
    const result = await query.first()
    if (!result) {
      return null
    }
    return result
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
      console.error('Error: ' + error.code + ' ' + error.message);
      return null;
    } else {
      // Handle the case where the error is not the expected type
      console.error('An unexpected error occurred');
      return null;
    }
  }
}

export async function getAwardForUser (user, awardId, year) {
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
    };
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
      console.error('Error: ' + error.code + ' ' + error.message);
      return null;
    } else {
      // Handle the case where the error is not the expected type
      console.error('An unexpected error occurred');
      return null;
    }
  }
}

export async function getAwardsForUser (user) {
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
      };
    })
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
      console.error('Error: ' + error.code + ' ' + error.message);
      return [];
    } else {
      // Handle the case where the error is not the expected type
      console.error('An unexpected error occurred');
      return [];
    }
  }
}

export async function giveAwardToUser (user, awardId)  {
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
    };
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
      console.error('Error: ' + error.code + ' ' + error.message);
      return null;
    } else {
      // Handle the case where the error is not the expected type
      console.error('An unexpected error occurred');
      return null;
    }
  }
}

export async function createTeam (teamName) {
  const teamRecord = new parse.Object('Team')
  const currentUser = parse.User.current()
  if (!currentUser) {
    console.error('No user found to save teamRecord.')
    return null  
  }
  // check if name already in use
  const existingTeam = await getTeam(teamName)
  if (existingTeam !== null) {
    console.warn('Team name is already in use.')
    return null
  }
  teamRecord.set('name', teamName)
  
  try {
    const savedTeamRecord = await teamRecord.save()
    console.log('TeamRecord has been saved.', savedTeamRecord)
    return savedTeamRecord
  } catch (error) {
    console.error('Error while saving teamRecord: ', error)
    return null
  }
}

export async function joinTeam (team, user, isCaptain) {
  const teamMemberRecord = new parse.Object('TeamMember')
  if (!user) {
    console.error('No user found to save teamMemberRecord.')
    return null  
  }
  if (!team) {
    console.error('No team found to save teamMemberRecord.')
    return null  
  }
  const currentTeam = await parseUtil.getTeamForUser(user)
  if (currentTeam) {
    console.error('User is already in a team.')
    return null
  }
  teamMemberRecord.set('team', team)
  teamMemberRecord.set('user', user)
  teamMemberRecord.set('isCaptain', isCaptain)
  teamMemberRecord.set('isAccepted', true)
  teamMemberRecord.set('joinDate', new Date())
  
  try {
    const savedTeamMemberRecord = await teamMemberRecord.save()
    console.log('TeamMemberRecord has been saved.', savedTeamMemberRecord)
    return savedTeamMemberRecord
  } catch (error) {
    console.error('Error while saving teamMemberRecord: ', error)
    return null
  }
}

export async function getAllTeams () {
  const query = new parse.Query('Team')
  query.limit(1000)

  try {
    const results = await query.find();
    return results
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
      console.error('Error: ' + error.code + ' ' + error.message);
      return [];
    } else {
      // Handle the case where the error is not the expected type
      console.error('An unexpected error occurred');
      return [];
    }
  }
}

export async function getTeam (teamName) {
  const query = new parse.Query('Team')
  query.equalTo('name', teamName)

  try {
    const result = await query.first();
    if (!result) {
      return null
    }
    return result
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
      console.error('Error: ' + error.code + ' ' + error.message);
      return null;
    } else {
      // Handle the case where the error is not the expected type
      console.error('An unexpected error occurred');
      return null;
    }
  }
}

export async function getTeamForUser (user) {
  const query = new parse.Query('TeamMember')
  query.equalTo('user', user)
  query.include('team')

  try {
    let result = await query.first();
    return result.get('team')
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
      console.error('Error: ' + error.code + ' ' + error.message);
      return undefined;
    } else {
      // Handle the case where the error is not the expected type
      console.error('An unexpected error occurred');
      return undefined;
    }
  }
}

export async function getTeamMembers (team) {
  const query = new parse.Query('TeamMember')
  query.equalTo('team', team)
  query.include('team')
  query.include('user')

  try {
    return await query.find();
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
      console.error('Error: ' + error.code + ' ' + error.message);
      return [];
    } else {
      // Handle the case where the error is not the expected type
      console.error('An unexpected error occurred');
      return [];
    }
  }
}

export async function getTotalKillCountForTeam (team) {
  if (!team) {
    console.error('No team found to get KillTotal.')
    return 0
  }
  let total = 0
  const teamMembers = await getTeamMembers(team)
  for (const memberKey in teamMembers) {
    if (Object.hasOwnProperty.call(teamMembers, memberKey)) {
      const member = teamMembers[memberKey];
      const memberTotal = await getTotalKillCountForUser(member.get('user'))
      total += memberTotal
    }
  }
  return total
}

export default {
  signUp,
  resetPassword,
  logIn,
  logOut,
  saveKillCount,
  getTotalKillCountForUser,
  getTotalKillCountForUserAndYear,
  getFirstKillForUserAndYear,
  getSessionsForUser,
  getAllUsers,
  getUser,
  getAward,
  getAwardForUser,
  getAwardsForUser,
  giveAwardToUser,
  createTeam,
  joinTeam,
  getAllTeams,
  getTeam,
  getTeamForUser,
  getTeamMembers,
  getTotalKillCountForTeam
}
