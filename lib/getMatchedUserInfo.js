const getMatchedUserInfo = (users, userLoggedIn) => {
  const newUsers = { ...users };
  delete newUsers[userLoggedIn];
  const [id, user] = Object.entries(newUsers).flat();
  return { id, ...user };//这是干啥呢 正好是arr和obj操作
};

export default getMatchedUserInfo;