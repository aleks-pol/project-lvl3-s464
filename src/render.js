const rssInput = document.getElementById('rssInput');
const feedsTable = document.getElementById('feedsTable');
const submitBtn = document.getElementById('submitBtn');
const articleList = document.getElementById('articleList');
const alertContainer = document.getElementById('alertContainer');
const articleModal = document.getElementById('articleModal');

export const inputRender = ({ url }) => {
  if (!url.valid) {
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

export const renderTable = ({ feeds }) => {
  feedsTable.innerHTML = '';
  feeds.forEach((feed) => {
    const row = renderRow(feed);
    feedsTable.appendChild(row);
  });
};

export const renderButton = ({ form }) => {
  if (form.state === 'loading') {
    submitBtn.innerHTML = `
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`;
    submitBtn.disabled = true;
  } else {
    submitBtn.innerHTML = 'Submit';
    submitBtn.disabled = false;
  }
};

export const renderArticles = ({ articles }) => {
  articleList.innerHTML = '';
  Object.values(articles).forEach((article) => {
    const el = document.createElement('div');
    el.innerHTML = `
      <li class="list-group-item">
        <a href="#" data-toggle="modal" data-target="#articleModal" data-article="${article.link}">
          ${article.title}
        </a>
      </li>
    `;
    articleList.appendChild(el);
  });
};

export const renderAlert = ({ form: { errorMessage } }) => {
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

export const renderModal = ({ openedArticle }) => {
  articleModal.querySelector('#articleModalLabel').innerText = openedArticle.title;
  articleModal.querySelector('.modal-body').innerText = openedArticle.description;
};
