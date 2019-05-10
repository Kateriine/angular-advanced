import { ThrobberDirective } from './throbber.directive';

describe('ThrobberDirective', () => {
  it('should create an instance', () => {
    const directive = new ThrobberDirective(
      undefined,
      undefined,
      undefined,
      undefined
    );
    expect(directive).toBeTruthy();
  });
});
