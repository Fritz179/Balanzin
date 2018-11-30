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
    console.log(obj);
    obj.onclick = () => {
      window.location.href = $(obj).attr('redirect')
    }
  });
})
