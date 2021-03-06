import $ from 'jquery';

const renderAlert = (errorMessage) => {
  const alertContainer = document.getElementById('alertContainer');
  const alertEl = `
   <div class="alert alert-danger alert-dismissible" role="alert">
      ${errorMessage}
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
      </div>
  `;
  alertContainer.innerHTML = alertEl;
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
  const feedsTable = document.getElementById('feedsTable');
  feedsTable.innerHTML = '';
  feeds.forEach((feed) => {
    const row = renderRow(feed);
    feedsTable.appendChild(row);
  });
};

export const renderForm = ({ form }) => {
  const rssInput = document.getElementById('rssInput');
  const submitBtn = document.getElementById('submitBtn');
  const rssForm = document.getElementById('rssForm');

  if (!form.valid) {
    rssInput.classList.add('is-invalid');
  } else {
    rssInput.classList.remove('is-invalid');
  }
  switch (form.submittingState) {
    case 'loading': {
      submitBtn.innerHTML = `
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`;
      submitBtn.disabled = true;
      break;
    }
    case 'success': {
      rssForm.reset();
      submitBtn.innerHTML = 'Submit';
      submitBtn.disabled = false;
      break;
    }
    case 'error': {
      submitBtn.innerHTML = 'Submit';
      submitBtn.disabled = false;
      rssInput.classList.add('is-invalid');
      renderAlert(form.errorMessage);
      break;
    }
    default:
      submitBtn.innerHTML = 'Submit';
      submitBtn.disabled = false;
      $('.alert').alert('close');
      break;
  }
};

export const renderArticles = ({ articles }) => {
  const articleList = document.getElementById('articleList');
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

export const renderModal = ({ openedArticle }) => {
  const articleModal = document.getElementById('articleModal');
  articleModal.querySelector('#articleModalLabel').innerText = openedArticle.title;
  articleModal.querySelector('.modal-body').innerText = openedArticle.description;
};
