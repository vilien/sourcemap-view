function User(options) {
  this.name = options.name;
  this.age = options.age;
}

const main = () => {
  const user = new User({ name: 'Lily', age: 21 });
  console.log(`Hello ${user.name}, your age is ${user.age}`);
}

main();