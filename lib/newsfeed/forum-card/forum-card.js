/**
 * Module Dependencies
 */

import dom from 'component-dom';
import Trianglify from 'trianglify';
import view from '../../view/mixin';
import template from './template.jade';

const palette = {
  YlGn: ['#d9f0a3', '#addd8e', '#78c679', '#41ab5d', '#238443', '#006837', '#004529'],
  GnBu: ['#a8ddb5', '#7bccc4', '#4eb3d3', '#2b8cbe', '#2b8cbe', '#0868ac', '#084081'],
  BuGn: ['#99d8c9', '#66c2a4', '#41ae76', '#238b45', '#238b45', '#006d2c', '#00441b'],
  PuBuGn: ['#D0D1E6', '#67a9cf', '#3690c0', '#3690c0', '#02818a', '#016c59', '#014636'],
  PuBu: ['#D0D1E6', '#74a9cf', '#3690c0', '#3690c0', '#0570b0', '#045a8d', '#023858'],
  PuRd: ['#d4b9da', '#c994c7', '#df65b0', '#e7298a', '#ce1256', '#980043', '#67001f'],
  OrRd: ['#fdd49e', '#fdbb84', '#fc8d59', '#ef6548', '#d7301f', '#b30000', '#7f0000'],
  YlOrRd: ['#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026'],
  YlOrBr: ['#fee391', '#fec44f', '#fe9929', '#ec7014', '#cc4c02', '#993404', '#662506'],
  Purples: ['#bcbddc', '#9e9ac8', '#807dba', '#6a51a3', '#6a51a3', '#54278f', '#3f007d'],
  Blues: ['#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#2171b5', '#08519c', '#08306b'],
  Greens: ['#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b'],
  Oranges: ['#fdae6b', '#fd8d3c', '#f16913', '#d94801', '#d94801', '#a63603', '#7f2704'],
  Reds: ['#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#cb181d', '#a50f15', '#67000d'],
  RdBu: ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#4393c3', '#2166ac', '#053061'],
  RdYlBu: ['#a50026', '#d73027', '#f46d43', '#f46d43', '#fdae61', '#4575b4', '#313695'],
  Spectral: ['#9e0142', '#d53e4f', '#f46d43', '#f46d43', '#fdae61', '#3288bd', '#5e4fa2']
};

export default class ForumCard extends view('appendable') {
  constructor(options = {}) {
    options.template = template;
    options.locals = { forum: options.forum };
    super(options);

    this.forum = options.forum;

    requestAnimationFrame(this.renderBackground.bind(this));
  }

  renderBackground() {
    let l = this.forum.id.length;
    const opts = {
      seed: parseInt(this.forum.id.slice(l - 9, l - 1), 16),
      palette: palette
    };

    var pattern = new Trianglify(opts);
    var cover = this.el.querySelector('.cover');
    dom(cover).css('background-image', `url(${pattern.png()})`);
  }
}
