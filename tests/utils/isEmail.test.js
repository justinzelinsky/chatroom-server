import { isEmail } from 'utils';

describe('isEmail function', () => {
  it('should correctly determine valid emails', () => {
    expect(isEmail('foo@bar.baz')).toEqual(true);
    expect(isEmail('foo')).toEqual(false);
  });
});
