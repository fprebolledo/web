
$(() => {
  const condicion = $('.scriptimages');
  console.log(condicion);
  if (condicion.length == 0) {
    return 0;
  }

  let slideIndex = 1;
  function showDivs(n) {
    let i;
    const x = $('.publication-image');
    const y = $('.borrar-imagen');

    if (n > x.length) { slideIndex = 1; }
    if (n < 1) { slideIndex = x.length; }

    if (n > y.length) { slideIndex = 1; }
    if (n < 1) { slideIndex = y.length; }

    // eslint-disable-next-line no-plusplus
    for (i = 0; i < x.length; i++) {
      x[i].style.display = 'none';
    }
    // eslint-disable-next-line no-plusplus
    for (i = 0; i < x.length; i++) {
      y[i].style.display = 'none';
    }
    x[slideIndex - 1].style.display = 'block';
    y[slideIndex - 1].style.display = 'block';
  }
  // eslint-disable-next-line camelcase
  function showDivs_n(n) {
    let i;
    const x = $('.publication-image');

    if (n > x.length) { slideIndex = 1; }
    if (n < 1) { slideIndex = x.length; }
    // eslint-disable-next-line no-plusplus
    for (i = 0; i < x.length; i++) {
      x[i].style.display = 'none';
    }
    x[slideIndex - 1].style.display = 'block';
  }

  const y = $('.borrar-imagen');

  if (y.length) {
    showDivs(slideIndex);
  } else {
    showDivs_n(slideIndex);
  }
  function plusDivs(n) {
    showDivs(slideIndex += n);
  }
  // eslint-disable-next-line camelcase
  function plusDivs_n(n) {
    showDivs_n(slideIndex += n);
  }
  const nocargar = $('.notscript');
  if (nocargar.length == 1) {
    return 0;
  }
  // eslint-disable-next-line func-names
  $('#button-left').click(() => {
    plusDivs(-1);
  });
  $('#button-right').click(() => {
    plusDivs(+1);
  });

  $('#button-left_n').click(() => {
    console.log('xd');
    plusDivs_n(-1);
  });
  $('#button-right_n').click(() => {
    plusDivs_n(+1);
    console.log('xd');
  });
});
