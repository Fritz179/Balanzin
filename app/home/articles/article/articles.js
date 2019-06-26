const el = document.getElementsByClassName("delete")[0]

if (el) {  
  const data_id = el.getAttribute('data_id')

  el.onclick = async () => {
    await fetch(`/articles/article/${data_id}`, {method: 'DELETE'})

    window.location = '/articles'
  }
}
