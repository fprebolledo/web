$(() => {
  let dest = false;
  $('#verdestacados').click(() => {
    if (!dest) {
      $('#verdestacados').html('Ocultar destacados');
      dest = true;
    } else {
      $('#verdestacados').html('Mostrar destacados');
      dest = false;
    }
    $('#destacados').toggle();
  });
});
