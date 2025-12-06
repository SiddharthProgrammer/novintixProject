const users = [];


function userJoin(id, username, people) {
   const user = { id, username, people };

   users.push(user);

   return user;
}


function getCurrentUser(id) {
   return users.find((user) => user.id === id);
}


function userLeave(id) {
   const index = users.findIndex((user) => user.id === id);

   if (index !== -1) {
      return users.splice(index, 1)[0];
   }
}


function getpeopleUsers(people) {
   return users.filter((user) => user.people === people);
}

module.exports = {
   userJoin,
   getCurrentUser,
   userLeave,
   getpeopleUsers,
};
