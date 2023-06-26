const geNameFrom = (cliArgs) => {
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

const greet = (username) => {
  return console.log(`Welcome to the File Manager, ${username}!`);
};
const goodbye = (username) =>
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);

export { geNameFrom, greet, goodbye };
