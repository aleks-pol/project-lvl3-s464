const rssInput = document.getElementById('rssInput');
const feedsTable = document.getElementById('feedsTable');
const submitBtn = document.getElementById('submitBtn');
const articleList = document.getElementById('articleList');
const alertContainer = document.getElementById('alertContainer');

export const inputRender = (state) => {
  if (!state.url.valid) {
    rssInput.classList.add('is-invalid');
  } else {
    rssInput.classList.remove('is-invalid');
  }
};

const renderRow = (feed) => {
  const row = document.createElement('tr');
  const titleCol = document.createElement('td');
  const descriptionCol = document.createElement('td');
  titleCol.innerText = feed.title;
  descriptionCol.innerText = feed.description;
  row.appendChild(titleCol);
  row.appendChild(descriptionCol);
  return row;
};

export const renderTable = (state) => {
  feedsTable.innerHTML = '';
  state.feeds.forEach((feed) => {
    const row = renderRow(feed);
    feedsTable.appendChild(row);
  });
};

export const renderButton = (state) => {
  if (state.form.state === 'loading') {
    submitBtn.innerHTML = `
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`;
    submitBtn.disabled = true;
  } else {
    submitBtn.innerHTML = 'Submit';
    submitBtn.disabled = false;
  }
};

export const renderArticles = (state) => {
  articleList.innerHTML = '';
  state.articles.forEach((article) => {
    const el = document.createElement('div');
    el.innerHTML = `
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">${article.title}</h5>
          <p class="card-text">${article.description}</p>
          <a href=${article.link} class="card-link">Read More</a>
        </div>
      </div>
    `;
    articleList.appendChild(el);
  });
};

export const renderAlert = (state) => {
  const { form: { errorMessage } } = state;
  const alertEl = `
   <div class="alert alert-warning alert-dismissible" role="alert">
      ${errorMessage}
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
      </div>
  `;
  alertContainer.innerHTML = alertEl;
};
