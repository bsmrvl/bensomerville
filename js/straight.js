var url = window.location.href;
var p = url.indexOf('/p/');
url = url.substring(p+3).replace('.html','');
var q = url.indexOf('?');
var h = url.indexOf('#');

var junk = '';
q > -1 && (junk = url.substring(q, (h > -1) ? h : (url.length+1)));

url = url.replace(junk, '');

sessionStorage.setItem('firstpage', url);
window.location.assign('/');