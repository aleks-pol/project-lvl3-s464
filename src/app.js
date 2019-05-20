import '@babel/polyfill';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { isURL } from 'validator';
import { watch } from 'melanke-watchjs';
import { keyBy, compose, merge } from 'lodash/fp';
import $ from 'jquery';
import getFeed from './api';
import parse from './parse';
import state from './state';

import {
  renderTable,
  renderForm,
  renderArticles,
  renderModal,
} from './view';

function fetchFeed(url) {
  return getFeed(url)
    .then((res) => {
      const [articles, feed] = parse(res.data);
      state.articles = compose(merge(state.articles), keyBy('link'))(articles);
      return feed;
    });
}


function poolArticles(url) {
  setTimeout(() => {
    fetchFeed(url).finally(() => poolArticles(url));
  }, 5000);
}


export default () => {
  const rssInput = document.getElementById('rssInput');
  const rssForm = document.getElementById('rssForm');

  rssInput.addEventListener('input', (event) => {
    const { target } = event;
    const { value } = target;
    state.form.url = value;
    state.form.state = '';
    state.form.valid = isURL(value);
  });

  rssForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!state.form.valid) {
      return;
    }
    if (!state.feeds.some(({ url }) => url === state.form.url)) {
      state.form.state = 'loading';
      fetchFeed(state.form.url).then((feed) => {
        state.form.state = 'success';
        state.feeds.push({
          ...feed,
          url: state.form.url,
        });
        poolArticles(state.form.url);
      }).catch((err) => {
        state.form.state = 'error';
        if (err.response.status === 404) {
          state.form.errorMessage = 'Feed not found';
        }
        throw err;
      });
    }
  });

  $('#articleModal').on('show.bs.modal', (event) => {
    const link = $(event.relatedTarget);
    state.openedArticle = state.articles[link.data('article').toString()];
  });

  watch(state, 'feeds', () => renderTable(state));
  watch(state, 'form', () => renderForm(state));
  watch(state, 'articles', () => renderArticles(state));
  watch(state, 'openedArticle', () => renderModal(state));
};
