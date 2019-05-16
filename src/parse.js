const parser = new DOMParser();
export default data => parser.parseFromString(data, 'application/xml');
