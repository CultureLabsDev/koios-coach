document.addEventListener('htmx:oobAfterSwap', function (evt) {
  console.log('oobAfterSwap', evt.detail.target);
  var el = evt.detail.target;
  var parse_id = el.getAttribute('data-md-parse');
  if (parse_id) {
    var elNew = document.getElementById(parse_id);
    elNew.innerHTML = marked.parse(el.innerHTML);
    // scroll to bottom of the element
    scroll = document.getElementById('scrollview');
    scroll.scrollTop = scroll.scrollHeight;
  }
});
