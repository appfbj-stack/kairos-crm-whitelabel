import Cookies from 'js-cookie';
import { IFrameHelper } from '../sdk/IFrameHelper';
import './sdk';

vi.mock('../sdk/IFrameHelper', () => ({
  IFrameHelper: {
    createFrame: vi.fn(),
    sendMessage: vi.fn(),
  },
}));

describe('$kairos_crm.setUser', () => {
  beforeEach(() => {
    delete window.$kairos_crm;
    window.kairos_crmSettings = {};
    vi.spyOn(Cookies, 'get').mockReturnValue(undefined);
    vi.spyOn(Cookies, 'set').mockImplementation(() => {});

    window.kairos_crmSDK.run({
      baseUrl: 'https://app.kairos_crm.com',
      websiteToken: 'website-token',
    });
  });

  afterEach(() => {
    delete window.$kairos_crm;
    delete window.kairos_crmSettings;
    vi.restoreAllMocks();
  });

  it('updates the SDK identity synchronously', () => {
    const user = { name: 'Pranav' };

    const result = window.$kairos_crm.setUser('first-user', user);

    expect(result).toBeUndefined();
    expect(window.$kairos_crm.identifier).toBe('first-user');
    expect(window.$kairos_crm.user).toBe(user);
    expect(IFrameHelper.sendMessage).toHaveBeenCalledWith('set-user', {
      identifier: 'first-user',
      user,
    });
  });

  it('keeps the latest identity after consecutive calls', () => {
    const firstUser = { name: 'First user' };
    const secondUser = { name: 'Second user' };

    window.$kairos_crm.setUser('first-user', firstUser);
    window.$kairos_crm.setUser('second-user', secondUser);

    expect(window.$kairos_crm.identifier).toBe('second-user');
    expect(window.$kairos_crm.user).toBe(secondUser);
    expect(IFrameHelper.sendMessage).toHaveBeenLastCalledWith('set-user', {
      identifier: 'second-user',
      user: secondUser,
    });
  });
});
