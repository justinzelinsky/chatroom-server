const validateRegisterInput = require('validation/register');

describe('validateRegisterInput test', () => {
  it('should return not errors when using a valid name, email and password', () => {
    const { error, isValid } = validateRegisterInput({
      name: 'Justin Zelinsky',
      email: 'justin@zelinsky.com',
      password: 'helloWorld',
      passwordConfirmation: 'helloWorld'
    });

    expect(error).toEqual('');
    expect(isValid).toEqual(true);
  });

  it('should return an error when missing a name', () => {
    const { error, isValid } = validateRegisterInput({});

    expect(error).toEqual('Name field is required');
    expect(isValid).toEqual(false);
  });

  it('should return an error when missing a email', () => {
    const { error, isValid } = validateRegisterInput({
      name: 'Justin Zelinsky'
    });

    expect(error).toEqual('Email field is required');
    expect(isValid).toEqual(false);
  });

  it('should return an error when using an invalid email', () => {
    const { error, isValid } = validateRegisterInput({
      name: 'Justin Zelinsky',
      email: 'hello'
    });

    expect(error).toEqual('Email is invalid');
    expect(isValid).toEqual(false);
  });

  it('should return an error when missing a password', () => {
    const { error, isValid } = validateRegisterInput({
      name: 'Justin Zelinsky',
      email: 'hello@world.com'
    });

    expect(error).toEqual('Password field is required');
    expect(isValid).toEqual(false);
  });

  it('should return an error when missing a confirm password', () => {
    const { error, isValid } = validateRegisterInput({
      name: 'Justin Zelinsky',
      email: 'hello@world.com',
      password: 'helloworld'
    });

    expect(error).toEqual('Confirm password field is required');
    expect(isValid).toEqual(false);
  });

  it('should return an error when password length requirements are not met', () => {
    const { error, isValid } = validateRegisterInput({
      name: 'Justin Zelinsky',
      email: 'hello@world.com',
      password: 'hi',
      passwordConfirmation: 'hi'
    });

    expect(error).toEqual('Password must be between 6 and 30 characters');
    expect(isValid).toEqual(false);
  });

  it('should return an error when passwords do not match', () => {
    const { error, isValid } = validateRegisterInput({
      name: 'Justin Zelinsky',
      email: 'hello@world.com',
      password: 'helloWorld',
      passwordConfirmation: 'greetingsPlanet'
    });

    expect(error).toEqual('Passwords must match');
    expect(isValid).toEqual(false);
  });
});
