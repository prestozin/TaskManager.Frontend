import { TestBed } from '@angular/core/testing';

import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenService);
  });

  it('ShouldSaveToken_WhenLoginResponseIsProvided', () => {
    service.save({ token: 'jwt-token' });

    expect(sessionStorage.getItem('token')).toBe('jwt-token');
  });

  it('ShouldReturnToken_WhenTokenExists', () => {
    sessionStorage.setItem('token', 'jwt-token');

    expect(service.getAccessToken()).toBe('jwt-token');
  });

  it('ShouldReturnNull_WhenTokenDoesNotExist', () => {
    expect(service.getAccessToken()).toBeNull();
  });

  it('ShouldClearSessionStorage_WhenClearIsCalled', () => {
    sessionStorage.setItem('token', 'jwt-token');
    sessionStorage.setItem('other', 'value');

    service.clear();

    expect(sessionStorage.length).toBe(0);
  });
});
