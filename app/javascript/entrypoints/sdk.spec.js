import Cookies from 'js-cookie';
import { IFrameHelper } from '../sdk/IFrameHelper';
import './sdk';

vi.mock('../sdk/IFrameHelper', () => ({
  IFrameHelper: {
    createFrame: vi.fn(),
    sendMessage: vi.fn(),
  },
}));

describe('$kairos-crm.setUser', () => {
  beforeEach(() => {
    delete window.$kairos-crm;
    window.kairos-crmSettings = {};
    vi.spyOn(Cookies, 'get').mockReturnValue(undefined);
    vi.spyOn(Cookies, 'set').mockImplementation(() => {});

    window.kairos-crmSDK.run({
      baseUrl: 'https://app.kairos-crm.com',
      websiteToken: 'website-token',
    });
  });

  afterEach(() => {
    delete window.$kairos-crm;
    delete window.kairos-crmSettings;
    vi.restoreAllMocks();
  });

  it('updates the SDK identity synchronously', () => {
    const user = { name: 'Pranav' };

    const result = window.$kairos-crm.setUser('first-user', user);

    expect(result).toBeUndefined();
    expect(window.$kairos-crm.identifier).toBe('first-user');
    expect(window.$kairos-crm.user).toBe(user);
    expect(IFrameHelper.sendMessage).toHaveBeenCalledWith('set-user', {
      identifier: 'first-user',
      user,
    });
  });

  it('keeps the latest identity after consecutive calls', () => {
    const firstUser = { name: 'First user' };
    const secondUser = { name: 'Second user' };

    window.$kairos-crm.setUser('first-user', firstUser);
    window.$kairos-crm.setUser('second-user', secondUser);

    expect(window.$kairos-crm.identifier).toBe('second-user');
    expect(window.$kairos-crm.user).toBe(secondUser);
    expect(IFrameHelper.sendMessage).toHaveBeenLastCalledWith('set-user', {
      identifier: 'second-user',
      user: secondUser,
    });
  });
});
