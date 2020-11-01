const UserService = require("../user.services");
const sinon = require("sinon");

describe("UserService test", () => {
  test("Module exists", () => {
    expect(UserService).toBeDefined();
  });

  test("creates a user", () => {
    const save = sinon.spy();
    let firstName;
    let lastName;
    let email;

    const MockModel = function (data) {
      firstName = data.firstName;
      lastName = data.lastName;
      email = data.email;

      return {
        ...data,
        save,
      };
    };

    const userService = UserService(MockModel);

    userService.createUser({
      firstName: "foo",
      lastName: "bar",
      email: "email@email",
    });

    expect(save.calledOnce).toEqual(true);
    expect(firstName).toEqual("foo");
    expect(lastName).toEqual("bar");
  });

  test("Password is hashed", () => {
    let password;
    const origPass = "password";

    password = UserService().hashPassword(origPass);

    expect(password).not.toEqual(origPass);
  });

  test("Hashed password is different each time", () => {
    const origPass = "password";

    let firstPass = UserService().hashPassword(origPass);

    let secondPass = UserService().hashPassword(origPass);

    expect(firstPass).not.toEqual(origPass);
    expect(secondPass).not.toEqual(origPass);
    expect(firstPass).not.toEqual(secondPass);
  });
});
