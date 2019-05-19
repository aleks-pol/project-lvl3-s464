import '@babel/polyfill';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { isURL } from 'validator';
import { watch } from 'melanke-watchjs';
import $ from 'jquery';
import getFeed from './api';
import parse from './parse';
import {
  inputRender, renderTable, renderButton, renderArticles,
  renderAlert, renderModal,
} from './render';

const rssInput = document.getElementById('rssInput');
const rssForm = document.getElementById('rssForm');

const state = {
  url: {
    valid: false,
    value: '',
  },
  feeds: [],
  form: {
    state: '',
    errorMessage: '',
  },
  articles: {},
  openedArticle: null,
};

rssInput.addEventListener('input', (event) => {
  const { target } = event;
  const { value } = target;
  state.url.value = value;
  state.url.valid = isURL(value);
  inputRender(state);
});


function parseArticle(article) {
  const title = article.querySelector('title').textContent;
  const description = article.querySelector('description').textContent;
  const link = article.querySelector('link').textContent;
  const pubDate = article.querySelector('pubDate').textContent;
  const creator = article.getElementsByTagName('dc:creator')[0].textContent;
  return {
    title,
    description,
    link,
    pubDate,
    creator,
  };
}

function fetchArticles(url) {
  return getFeed(url).then((res) => {
    const parsedData = parse(res.data);
    const articles = parsedData.querySelectorAll('item');
    const parsedArticles = [...articles].map(parseArticle);
    state.articles = parsedArticles.reduce((acc, article) => (acc[article.link]
      ? acc : { [article.link]: article, ...acc }), state.articles);
    setTimeout(() => {
      fetchArticles(url);
    }, 5000);
    return parsedData;
  }).catch((err) => {
    state.form.state = 'error';
    if (err.response.status === 404) {
      state.form.errorMessage = 'Feed not found';
    }
  });
}

rssForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!state.url.valid) {
    return;
  }
  if (!state.feeds.some(({ url }) => url === state.url.value)) {
    state.form.state = 'loading';
    fetchArticles(state.url.value).then((parsedData) => {
      state.form.state = '';
      rssForm.reset();
      state.feeds.push({
        url: state.url.value,
        title: parsedData.querySelector('title').textContent,
        description: parsedData.querySelector('description').textContent,
      });
    });
  }
});

$('#articleModal').on('show.bs.modal', (event) => {
  const link = $(event.relatedTarget);
  state.openedArticle = state.articles[link.data('article').toString()];
});

watch(state, 'feeds', () => renderTable(state));
watch(state, 'form', () => {
  renderButton(state);
  if (state.form.state === 'error') {
    renderAlert(state);
    $('.alert').on('closed.bs.alert', () => {
      state.form.state = '';
    });
  }
});
watch(state, 'articles', () => renderArticles(state));
watch(state, 'openedArticle', () => renderModal(state));
