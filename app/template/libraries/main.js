$(document).ready(() => {
  $('.clickable').each((i, obj) => {
    obj.onclick = () => {
      window.location.href = $(obj).attr('redirect')
    }
  });

  $('.message').each((i, obj) => {
    setTimeout(() => {
      $(obj).fadeOut(1000, function() { $(this).remove(); })
    }, 2000)
  })
})
