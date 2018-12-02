$(document).ready(() => {
  $('.delete-article').on('click', e => {
    $target = $(e.target)
    const id = $target.attr('data-id')
    $.ajax({
      type: 'DELETE',
      url: '/articles/' + id,
      success: response => {
        window.location.href = response
      },
      error: err => {
        console.log(err);
      }
    })
  })

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
