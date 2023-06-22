const getUsername = (cliArgs) => {
  const username = cliArgs
    .filter((arg) => arg.includes("username"))
    .toString()
    .split("=")
    .slice(1)
    .join("")
    .trim();

  if (username) return username;

  return "Unknown User";
};

const greetUser = (username) => {
  return console.log(`Welcome to the File Manager, ${username}!`);
};
const goodbyeUser = (username) =>
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);

export { getUsername as youNameIt, greetUser, goodbyeUser };
