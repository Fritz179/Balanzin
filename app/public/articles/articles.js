$(document).ready(() => {
  $('.delete-article').on('click', e => {
    let target = $(e.target)
    const id = target.attr('data-id')
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
})
