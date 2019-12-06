const validateLoginInput = require('validation/login');

describe('validateLoginInput test', () => {
  it('should return not errors when using a valid email and password', () => {
    const { error, isValid } = validateLoginInput({
      email: 'justin@zelinsky.com',
      password: 'helloWorld'
    });

    expect(error).toEqual('');
    expect(isValid).toEqual(true);
  });

  it('should return an error when missing an email', () => {
    const { error, isValid } = validateLoginInput({});

    expect(error).toEqual('Email field is required');
    expect(isValid).toEqual(false);
  });

  it('should return an error when using an invalid email', () => {
    const { error, isValid } = validateLoginInput({ email: 'hello' });

    expect(error).toEqual('Email is invalid');
    expect(isValid).toEqual(false);
  });

  it('should return an error when missing a password', () => {
    const { error, isValid } = validateLoginInput({ email: 'hello@world.com' });

    expect(error).toEqual('Password field is required');
    expect(isValid).toEqual(false);
  });
});
