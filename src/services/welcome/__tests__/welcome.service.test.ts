import { describe, it, expect, beforeEach } from 'vitest';
import { welcomeService } from '../index';

describe('welcomeService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('isAccepted', () => {
    it('returns false when localStorage has no entry', () => {
      expect(welcomeService.isAccepted()).toBe(false);
    });

    it('returns false when entry is not "true"', () => {
      localStorage.setItem('welcomeAccepted', 'false');
      expect(welcomeService.isAccepted()).toBe(false);
    });

    it('returns true after accept() has been called', () => {
      welcomeService.accept();
      expect(welcomeService.isAccepted()).toBe(true);
    });

    it('returns true when localStorage already has "true"', () => {
      localStorage.setItem('welcomeAccepted', 'true');
      expect(welcomeService.isAccepted()).toBe(true);
    });
  });

  describe('accept', () => {
    it('persists the accepted state in localStorage', () => {
      welcomeService.accept();
      expect(localStorage.getItem('welcomeAccepted')).toBe('true');
    });

    it('calling accept twice is idempotent', () => {
      welcomeService.accept();
      welcomeService.accept();
      expect(welcomeService.isAccepted()).toBe(true);
    });
  });
});
