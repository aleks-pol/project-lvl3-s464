import '@babel/polyfill';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { isURL } from 'validator';
import { watch } from 'melanke-watchjs';
import { uniqueId } from 'lodash/fp';
import $ from 'jquery';
import getFeed from './api';
import parse from './parse';
import {
  inputRender, renderTable, renderButton, renderArticles,
  renderAlert,
} from './render';

const rssInput = document.getElementById('rssInput');
const rssForm = document.getElementById('rssForm');

const state = {
  url: {
    valid: true,
    value: 'http://lorem-rss.herokuapp.com/feed',
  },
  feeds: [],
  form: {
    state: '',
    errorMessage: '',
  },
  articles: [],
};

rssInput.addEventListener('input', (event) => {
  const { target } = event;
  const { value } = target;
  state.url.value = value;
  state.url.valid = isURL(value);
  inputRender(state);
});

rssForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!state.url.valid) {
    return;
  }
  if (!state.feeds.some(({ url }) => url === state.url.value)) {
    state.form.state = 'loading';
    getFeed(state.url.value).then((res) => {
      const parsedData = parse(res.data);
      state.feeds.push({
        title: parsedData.querySelector('title').textContent,
        description: parsedData.querySelector('description').textContent,
      });
      const articles = parsedData.querySelectorAll('item');
      const mappedArtices = [...articles].map((article) => {
        const title = article.querySelector('title').textContent;
        const description = article.querySelector('description').textContent;
        const link = article.querySelector('link').textContent;
        const pubDate = article.querySelector('pubDate').textContent;
        const creator = article.getElementsByTagName('dc:creator')[0].textContent;
        return {
          id: uniqueId(),
          title,
          description,
          link,
          pubDate,
          creator,
        };
      });
      state.articles = mappedArtices;
      state.form.state = '';
      rssForm.reset();
    }).catch((err) => {
      state.form.state = 'error';
      console.dir(err);
      if (err.response.status === 404) {
        state.form.errorMessage = 'Feed not found';
      }
    });
  }
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
