import { describe, expect, it } from 'vitest';
import { glueHtml, glueText } from './typography';

const nbsp = String.fromCharCode(0xa0);

describe('glueText', () => {
  it('keeps single letter words with the next word', () => {
    expect(glueText('Dom w lesie i z psem')).toBe(`Dom w${nbsp}lesie i${nbsp}z${nbsp}psem`);
  });

  it('glues single letters after line breaks and quotes', () => {
    expect(glueText('pierwszy\n  i drugi')).toBe(`pierwszy\n  i${nbsp}drugi`);
    expect(glueText('„w domu”')).toBe(`„w${nbsp}domu”`);
  });

  it('does not touch longer words', () => {
    expect(glueText('wiosna zima')).toBe('wiosna zima');
    expect(glueText('on i ona')).toBe(`on i${nbsp}ona`);
  });

  it('glues numbers to units', () => {
    expect(glueText('od 52 m² do 61 zł')).toBe(`od 52${nbsp}m² do 61${nbsp}zł`);
    expect(glueText('5 m od 5 metrów')).toBe(`5${nbsp}m od 5 metrów`);
    expect(glueText('stan 100 %')).toBe(`stan 100${nbsp}%`);
  });

  it('glues abbreviations to what follows', () => {
    expect(glueText('art. 66 Kodeksu')).toBe(`art.${nbsp}66 Kodeksu`);
    expect(glueText('ul. Wrzecionowa 2')).toBe(`ul.${nbsp}Wrzecionowa 2`);
  });
});

describe('glueHtml', () => {
  it('only changes text between tags', () => {
    expect(glueHtml('<p class="a i b">Dom w lesie</p>')).toBe(
      `<p class="a i b">Dom w${nbsp}lesie</p>`,
    );
  });

  it('leaves scripts and styles alone', () => {
    const html = '<script>var a = 1; if (a) w ()</script><style>a i b</style><p>a b</p>';
    expect(glueHtml(html)).toBe(
      `<script>var a = 1; if (a) w ()</script><style>a i b</style><p>a${nbsp}b</p>`,
    );
  });

  it('does not join across tags', () => {
    expect(glueHtml('<p>kot i <b>pies</b></p>')).toBe('<p>kot i <b>pies</b></p>');
  });
});
