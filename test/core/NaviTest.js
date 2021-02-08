const expect = require('chai').expect;
require('jsdom-global')();

import Navi from '../../src/core/Navi';

describe('Navi', () => {
  describe('#getIsLinkElementCompatible()', () => {
    it('should return true for internal links with no target', () => {
      let anchor = document.createElement('a');
      anchor.setAttribute('href', '/page.html');
      expect(Navi.getIsLinkElementCompatible(anchor)).to.be.true;
    });
    it('should return true for internal links targeting _self', () => {
      let anchor = document.createElement('a');
      anchor.setAttribute('href', '/page.html');
      anchor.setAttribute('target', '_self');
      expect(Navi.getIsLinkElementCompatible(anchor)).to.be.true;
    });
    it('should return false for external hrefs', () => {
      let anchor = document.createElement('a');
      anchor.setAttribute('href', 'https://page.com');
      expect(Navi.getIsLinkElementCompatible(anchor)).to.be.false;
    });
    it('should return false for internal links with external target', () => {
      let anchor = document.createElement('a');
      anchor.setAttribute('href', '/page.html');
      anchor.setAttribute('target', '_blank');
      expect(Navi.getIsLinkElementCompatible(anchor)).to.be.false;
    });
    it('should return false for internal links with external rel', () => {
      let anchor = document.createElement('a');
      anchor.setAttribute('href', '/page.html');
      anchor.setAttribute('rel', 'external');
      expect(Navi.getIsLinkElementCompatible(anchor)).to.be.false;
    });
    it('should return false for internal links with (empty) download attribute', () => {
      let anchor = document.createElement('a');
      anchor.setAttribute('href', '/page.html');
      anchor.setAttribute('download', "");
      expect(Navi.getIsLinkElementCompatible(anchor)).to.be.false;
    });
    it('should return false for internal links with stim-ignore attribute', () => {
      let anchor = document.createElement('a');
      anchor.setAttribute('href', '/page.html');
      anchor.setAttribute('stim-ignore', true);
      expect(Navi.getIsLinkElementCompatible(anchor)).to.be.false;
    });
    it('should return false for internal links with empty stim-ignore attribute', () => {
      let anchor = document.createElement('a');
      anchor.setAttribute('href', '/page.html');
      anchor.setAttribute('stim-ignore', "");
      expect(Navi.getIsLinkElementCompatible(anchor)).to.be.false;
    });
  });

  describe('#getIsLinkElementBound()', () => {
    it('should return true for links with stim-bound property', () => {
      let anchor = document.createElement('a');
      anchor.setAttribute('href', '/page.html');
      anchor.setAttribute('stim-bound', true);
      expect(Navi.getIsLinkElementBound(anchor)).to.be.true;
    });
    it('should return false for links without stim-bound property', () => {
      let anchor = document.createElement('a');
      anchor.setAttribute('href', '/page.html');
      expect(Navi.getIsLinkElementBound(anchor)).to.be.false;
    });
  });

  describe('#bindLinkElement()', () => {
    it('should set stim-bound property', () => {
      let anchor = document.createElement('a');
      anchor.setAttribute('href', '/page.html');
      Navi.bindLinkElement(anchor);
      expect(anchor.getAttribute('stim-bound')).to.equal('true');
    });
  });
});